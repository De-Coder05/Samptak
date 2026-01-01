import tensorflow as tf
import os
import numpy as np

# Define custom objects needed for loading
def focal_loss(gamma=2.0, alpha=0.25):
    def focal_loss_fixed(y_true, y_pred):
        return tf.reduce_mean(-y_true * tf.math.log(y_pred + 1e-7))
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

model_path = 'models/best_model.h5'
tflite_path = 'models/model.tflite'

print(f"Loading Keras model from {model_path}...")

if not os.path.exists(model_path):
    print("❌ Model file not found!")
    exit(1)

try:
    custom_objects = {
        'focal_loss_fixed': focal_loss(gamma=2.0, alpha=0.25),
        'CustomScaleLayer': CustomScaleLayer
    }
    
    # Load Keras model
    model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)
    print("✅ Model loaded successfully.")

    # Convert to TFLite
    print("Converting to TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Optional: Optimizations
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    tflite_model = converter.convert()

    # Save
    with open(tflite_path, 'wb') as f:
        f.write(tflite_model)
    
    print(f"✅ TFLite model saved to {tflite_path}")
    
    # Size comparison
    k_size = os.path.getsize(model_path) / (1024 * 1024)
    t_size = os.path.getsize(tflite_path) / (1024 * 1024)
    print(f"Original Size: {k_size:.2f} MB")
    print(f"TFLite Size:   {t_size:.2f} MB")
    print(f"Reduction:     {(1 - t_size/k_size)*100:.1f}%")

except Exception as e:
    print(f"❌ Error during conversion: {e}")
    import traceback
    traceback.print_exc()
