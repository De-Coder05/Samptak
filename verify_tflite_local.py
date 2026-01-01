import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.applications.inception_resnet_v2 import preprocess_input

model_path = 'models/model.tflite'
print(f"Checking {model_path}...")

if not os.path.exists(model_path):
    print("❌ Model file not found!")
    exit(1)

try:
    # Load TFLite model
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    print("✅ TFLite Model loaded successfully.")
    
    # Create dummy input (1, 300, 300, 3)
    dummy_input = np.random.randint(0, 255, (1, 300, 300, 3)).astype(np.float32)
    
    # Preprocess
    dummy_input = preprocess_input(dummy_input)
    
    # Set input
    interpreter.set_tensor(input_details[0]['index'], dummy_input)
    
    # Run
    interpreter.invoke()
    
    # Get output
    output_data = interpreter.get_tensor(output_details[0]['index'])
    score = output_data[0][0]
    
    print(f"Prediction Output: {output_data}")
    print(f"Score: {score}")
    
    if np.isnan(score):
        print("❌ OUTPUT IS NaN! TFLite conversion might have issues.")
    else:
        print("✅ Output is a valid number.")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
