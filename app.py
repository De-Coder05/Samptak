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
model_path = 'models/model.tflite'
interpreter = None
input_details = None
output_details = None

def load_prediction_model():
    global interpreter, input_details, output_details
    if os.path.exists(model_path):
        try:
            # Load TFLite model
            interpreter = tf.lite.Interpreter(model_path=model_path)
            interpreter.allocate_tensors()
            
            input_details = interpreter.get_input_details()
            output_details = interpreter.get_output_details()
            
            print(f"✅ TFLite Model loaded from {model_path}")
        except Exception as e:
            print(f"❌ Error loading TFLite model: {e}")
    else:
        print(f"⚠️  Model not found at {model_path}. Please run convert_to_tflite.py first.")

# Initial load
load_prediction_model()

@app.get('/')
def index():
    return {'message': 'Crack Detection API - Classifies images as crack or non-crack', 'status': 'running'}

@app.get('/health')
def health():
    return {
        'status': 'healthy', 
        'model_loaded': interpreter is not None
    }

# CORS configuration
ALLOWED_ORIGINS = [
    "*", # Allow all origins for Vercel deployment
    "http://localhost:3000",
    "http://localhost:127.0.0.1:3000",
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
    
    # Preprocess input (same as training)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    
    return img_array

def predict_crack(image: Image.Image):
    """Crack detection using TFLite"""
    if interpreter is None:
        return {'error': True, 'message': 'Model not loaded correctly.'}

    try:
        # Preprocess
        img_array = preprocess_image(image)
        
        # Set input tensor
        interpreter.set_tensor(input_details[0]['index'], img_array)
        
        # Run inference
        interpreter.invoke()
        
        # Get output tensor
        prediction = interpreter.get_tensor(output_details[0]['index'])
        score = float(prediction[0][0])
        
        # Probability logic (assuming 0=Faulty, 1=Normal based on previous findings)
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
