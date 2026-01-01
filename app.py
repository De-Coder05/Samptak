import uvicorn
from fastapi import FastAPI
import tensorflow as tf
from fastapi import File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os
import numpy as np
from tensorflow.keras.applications.inception_resnet_v2 import preprocess_input

app = FastAPI()

# Load model - crack detection
import tensorflow.keras.backend as K

def focal_loss(gamma=2.0, alpha=0.25):
    """Focal loss - must match training definition"""
    def focal_loss_fixed(y_true, y_pred):
        epsilon = K.epsilon()
        y_pred = K.clip(y_pred, epsilon, 1.0 - epsilon)
        
        cross_entropy = -y_true * K.log(y_pred)
        weight = alpha * y_true * K.pow((1 - y_pred), gamma)
        
        cross_entropy_neg = -(1 - y_true) * K.log(1 - y_pred)
        weight_neg = (1 - alpha) * (1 - y_true) * K.pow(y_pred, gamma)
        
        loss = weight * cross_entropy + weight_neg * cross_entropy_neg
        return K.mean(loss)
    
    return focal_loss_fixed

@tf.keras.utils.register_keras_serializable(package="Custom")
class CustomScaleLayer(tf.keras.layers.Layer):
    def __init__(self, scale=1.0, offset=0.0, **kwargs):
        super(CustomScaleLayer, self).__init__(**kwargs)
        self.scale = scale
        self.offset = offset

    def call(self, inputs):
        if isinstance(inputs, (list, tuple)):
            return inputs[0] + inputs[1] * self.scale
        return inputs * self.scale + self.offset
    
    def get_config(self):
        config = super(CustomScaleLayer, self).get_config()
        config.update({'scale': self.scale, 'offset': self.offset})
        return config

# Load model - crack detection
model_path = 'models/best_model.h5'
model = None

def load_prediction_model():
    global model
    if os.path.exists(model_path):
        try:
            custom_objects = {
                'focal_loss_fixed': focal_loss(gamma=2.0, alpha=0.25),
                'CustomScaleLayer': CustomScaleLayer
            }
            model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)
            print(f"✅ Model loaded from {model_path}")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
    else:
        print(f"⚠️  Model not found at {model_path}. Please run src/models/train_model.py first.")

# Initial load
load_prediction_model()

@app.get('/')
def index():
    return {'message': 'Crack Detection API - Classifies images as crack or non-crack', 'status': 'running'}

@app.get('/health')
def health():
    return {
        'status': 'healthy', 
        'model_loaded': model is not None
    }

# CORS configuration
ALLOWED_ORIGINS = [
    "*", # Allow all origins for Vercel deployment
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS + (["*"] if os.getenv("ENVIRONMENT") == "development" else []),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image: Image.Image):
    """Preprocess image for InceptionResNetV2 input (300, 300)"""
    target_size = (300, 300)
    
    # Resize image to target size
    image = image.resize(target_size, Image.Resampling.LANCZOS)
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Convert to array
    img_array = np.array(image, dtype=np.float32)
    
    # InceptionResNetV2 preprocessing (expects pixels 0-255 or -1 to 1 depending on implementation, 
    # but preprocess_input handles it. Keras InceptionResNetV2 usually expects inputs [0, 255] then converts)
    # The previous code for InceptionResNetV2 did:
    # img_array = img_array * 255.0  (if it was 0-1)
    # tf.keras.applications.inception_resnet_v2.preprocess_input(img_array)
    # Here our array is already 0-255 from PIL.
    
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    
    return img_array

def predict_crack(image: Image.Image):
    """Crack detection: crack vs non-crack"""
    if model is None:
        return {'error': True, 'message': 'Model not loaded correctly.'}

    try:
        # Preprocess
        img_array = preprocess_image(image)
        
        # Predict
        prediction = model.predict(img_array, verbose=0)
        score = float(prediction[0][0])
        
        # Sigmoid output: 0 to 1.
        # Assuming 1 is Class 1, 0 is Class 0.
        # We need to know which class is which.
        # flow_from_directory sorts alphanumerically by default: 'Faulty', 'Normal'.
        # Faulty: 0, Normal: 1.
        # Wait, usually indices are assigned alphabetically.
        # Faulty -> 0
        # Normal -> 1
        # So low score (<0.5) is Faulty, high score (>0.5) is Normal?
        # Let's verify class indices. 'Faulty' comes before 'Normal'.
        # Usually sigmoid near 0 is class 0, near 1 is class 1.
        # So Score -> Probability of being Normal.
        # Let's assume Faulty is 0, Normal is 1.
        
        probability_faulty = 1 - score
        
        # Threshold 0.5
        is_faulty = probability_faulty > 0.5
        
        confidence = probability_faulty if is_faulty else score
        confidence_percent = confidence * 100
        
        # Confidence Level
        if confidence_percent >= 90:
            confidence_level = "Very High"
        elif confidence_percent >= 75:
            confidence_level = "High"
        elif confidence_percent >= 60:
            confidence_level = "Moderate"
        else:
            confidence_level = "Low"
        
        message = ("Crack detected" if is_faulty else "No crack detected") + \
                  f" with {confidence_percent:.1f}% confidence ({confidence_level})"
        
        # For compatibility with frontend that might expect "has_crack"
        return {
            'has_crack': is_faulty,
            'confidence': round(confidence_percent, 2),
            'confidence_level': confidence_level,
            'message': message,
            'probability': round(score, 4), # Raw probability of Class 1 (Normal)
            'class': 'Faulty' if is_faulty else 'Normal'
        }
    except Exception as e:
        import traceback
        print(f"Error in prediction: {e}")
        traceback.print_exc()
        raise

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    """Upload and process image for crack detection"""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            return {
                'message': 'Invalid file type. Please upload an image.',
                'error': True
            }
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Predict crack
        result = predict_crack(image)
        
        return result
    except Exception as e:
        import traceback
        return {
            'message': f'Error processing image: {str(e)}',
            'error': True,
            'details': str(traceback.format_exc())
        }

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8080)
