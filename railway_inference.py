import os
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_resnet_v2 import preprocess_input
from PIL import Image
import tensorflow as tf

# ============================================================================
# CONFIGURATION
# ============================================================================

MODEL_PATH = '/kaggle/working/model_final_optimized.keras'
THRESHOLD_PATH = '/kaggle/working/optimal_threshold.npy'
INFERENCE_DIR = "/path/to/your/inference/images"  # Update this path
OUTPUT_DIR = "/kaggle/working/inference_results"
IMG_SIZE = (300, 300)

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================================
# CUSTOM OBJECTS FOR FOCAL LOSS
# ============================================================================

def focal_loss(gamma=2.0, alpha=0.25):
    """Focal loss - must match training definition"""
    def focal_loss_fixed(y_true, y_pred):
        epsilon = tf.keras.backend.epsilon()
        y_pred = tf.clip_by_value(y_pred, epsilon, 1.0 - epsilon)
        
        cross_entropy = -y_true * tf.math.log(y_pred)
        weight = alpha * y_true * tf.pow((1 - y_pred), gamma)
        
        cross_entropy_neg = -(1 - y_true) * tf.math.log(1 - y_pred)
        weight_neg = (1 - alpha) * (1 - y_true) * tf.pow(y_pred, gamma)
        
        loss = weight * cross_entropy + weight_neg * cross_entropy_neg
        return tf.reduce_mean(loss)
    
    return focal_loss_fixed

# ============================================================================
# LOAD MODEL AND THRESHOLD
# ============================================================================

print("Loading model and optimal threshold...")

# Load model with custom objects
custom_objects = {'focal_loss_fixed': focal_loss(gamma=2.0, alpha=0.25)}
model = load_model(MODEL_PATH, custom_objects=custom_objects)

# Load optimal threshold
if os.path.exists(THRESHOLD_PATH):
    optimal_threshold = np.load(THRESHOLD_PATH)
    print(f"Using optimal threshold: {optimal_threshold:.3f}")
else:
    optimal_threshold = 0.5
    print(f"Optimal threshold not found, using default: {optimal_threshold}")

print("Model loaded successfully!\n")

# ============================================================================
# INFERENCE FUNCTIONS
# ============================================================================

def preprocess_image(img_path):
    """Preprocess image for model input"""
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

def predict_single_image(img_path, threshold=0.5):
    """Predict crack/no-crack for a single image"""
    img_array = preprocess_image(img_path)
    prediction_prob = model.predict(img_array, verbose=0)[0][0]
    prediction_class = 'Crack' if prediction_prob > threshold else 'Normal'
    confidence = prediction_prob if prediction_prob > threshold else (1 - prediction_prob)
    
    return {
        'probability': prediction_prob,
        'class': prediction_class,
        'confidence': confidence
    }

def predict_batch(image_paths, batch_size=32, threshold=0.5):
    """Predict for multiple images efficiently"""
    results = []
    
    # Process in batches
    for i in range(0, len(image_paths), batch_size):
        batch_paths = image_paths[i:i + batch_size]
        batch_images = []
        
        for img_path in batch_paths:
            img_array = preprocess_image(img_path)
            batch_images.append(img_array[0])
        
        batch_images = np.array(batch_images)
        predictions = model.predict(batch_images, verbose=0)
        
        for img_path, pred_prob in zip(batch_paths, predictions):
            pred_prob = pred_prob[0]
            pred_class = 'Crack' if pred_prob > threshold else 'Normal'
            confidence = pred_prob if pred_prob > threshold else (1 - pred_prob)
            
            results.append({
                'image': os.path.basename(img_path),
                'path': img_path,
                'probability': pred_prob,
                'class': pred_class,
                'confidence': confidence
            })
    
    return results

def visualize_predictions(results, save_dir=OUTPUT_DIR, max_display=16):
    """Visualize predictions with images"""
    num_images = min(len(results), max_display)
    cols = 4
    rows = (num_images + cols - 1) // cols
    
    fig, axes = plt.subplots(rows, cols, figsize=(20, 5*rows))
    axes = axes.flatten() if num_images > 1 else [axes]
    
    for idx, result in enumerate(results[:max_display]):
        img = Image.open(result['path'])
        
        axes[idx].imshow(img)
        axes[idx].axis('off')
        
        # Color based on prediction
        color = 'red' if result['class'] == 'Crack' else 'green'
        title = f"{result['class']}\nConf: {result['confidence']:.2%}\nProb: {result['probability']:.3f}"
        axes[idx].set_title(title, fontsize=12, color=color, weight='bold')
    
    # Hide unused subplots
    for idx in range(num_images, len(axes)):
        axes[idx].axis('off')
    
    plt.tight_layout()
    save_path = os.path.join(save_dir, 'predictions_visualization.png')
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    plt.show()
    print(f"Visualization saved to: {save_path}")

def save_results_to_csv(results, save_dir=OUTPUT_DIR):
    """Save results to CSV file"""
    import csv
    
    csv_path = os.path.join(save_dir, 'predictions.csv')
    
    with open(csv_path, 'w', newline='') as csvfile:
        fieldnames = ['image', 'class', 'probability', 'confidence']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for result in results:
            writer.writerow({
                'image': result['image'],
                'class': result['class'],
                'probability': f"{result['probability']:.4f}",
                'confidence': f"{result['confidence']:.4f}"
            })
    
    print(f"Results saved to: {csv_path}")

# ============================================================================
# RUN INFERENCE
# ============================================================================

print("="*60)
print("RUNNING INFERENCE")
print("="*60 + "\n")

# Get all image files
image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
image_files = [
    os.path.join(INFERENCE_DIR, f) 
    for f in os.listdir(INFERENCE_DIR)
    if os.path.splitext(f)[1].lower() in image_extensions
]

if not image_files:
    print(f"No images found in {INFERENCE_DIR}")
    print("Please update INFERENCE_DIR with the correct path.")
else:
    print(f"Found {len(image_files)} images")
    print(f"Using threshold: {optimal_threshold:.3f}\n")
    
    # Run batch prediction
    print("Processing images...")
    results = predict_batch(image_files, batch_size=32, threshold=optimal_threshold)
    
    # Print results
    print("\n" + "="*60)
    print("PREDICTION RESULTS")
    print("="*60 + "\n")
    
    crack_count = sum(1 for r in results if r['class'] == 'Crack')
    normal_count = len(results) - crack_count
    
    print(f"Total images: {len(results)}")
    print(f"Cracks detected: {crack_count} ({crack_count/len(results)*100:.1f}%)")
    print(f"Normal tracks: {normal_count} ({normal_count/len(results)*100:.1f}%)\n")
    
    # Show detailed results
    print("Detailed Results:")
    print("-" * 80)
    print(f"{'Image':<40} {'Prediction':<10} {'Probability':<12} {'Confidence':<12}")
    print("-" * 80)
    
    for result in sorted(results, key=lambda x: x['probability'], reverse=True):
        print(f"{result['image']:<40} {result['class']:<10} "
              f"{result['probability']:>10.4f}  {result['confidence']:>10.2%}")
    
    # Save results
    print("\n" + "="*60)
    print("SAVING RESULTS")
    print("="*60 + "\n")
    
    save_results_to_csv(results, OUTPUT_DIR)
    visualize_predictions(results, OUTPUT_DIR, max_display=16)
    
    # Show high-confidence cracks (potential critical issues)
    high_conf_cracks = [r for r in results if r['class'] == 'Crack' and r['confidence'] > 0.9]
    if high_conf_cracks:
        print(f"\n⚠️  HIGH CONFIDENCE CRACKS DETECTED ({len(high_conf_cracks)} images):")
        for r in high_conf_cracks:
            print(f"  - {r['image']}: {r['confidence']:.2%} confidence")
    
    print("\n" + "="*60)
    print("INFERENCE COMPLETE!")
    print("="*60)