"""
Improved Training Script for Railway Track Detection and Crack Detection Models
Key improvements:
- Better data augmentation strategy
- Transfer learning with pre-trained backbone
- Class weighting for imbalanced datasets
- Better validation metrics
"""
import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from PIL import Image
import cv2
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
from sklearn.utils.class_weight import compute_class_weight
import glob

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Configuration
IMG_SIZE = 299  # InceptionResNetV2 uses 299x299
BATCH_SIZE = 16  # Reduced for better gradient updates
EPOCHS_CRACK = 100
TRACK_IMAGES_DIR = 'TrackImages'
CRACK_MODEL_PATH = 'crack_model.keras'

def load_and_preprocess_image(image_path, target_size=(IMG_SIZE, IMG_SIZE)):
    """Load and preprocess an image"""
    try:
        img = Image.open(image_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize(target_size, Image.Resampling.LANCZOS)
        img_array = np.array(img, dtype=np.float32) / 255.0
        return img_array
    except Exception as e:
        print(f"Error loading {image_path}: {e}")
        return None

def get_augmentation_model():
    """Create data augmentation layer"""
    return keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.2),
        layers.RandomContrast(0.2),
        layers.RandomBrightness(0.2),
    ], name="data_augmentation")

def create_track_dataset():
    """Create dataset for track vs non-track classification"""
    print("=" * 60)
    print("Creating Track Detection Dataset")
    print("=" * 60)
    
    # Load track images
    track_files = []
    track_patterns = [
        os.path.join(TRACK_IMAGES_DIR, '*.jpg'),
        os.path.join(TRACK_IMAGES_DIR, '*.jpeg'),
        os.path.join(TRACK_IMAGES_DIR, '*.png')
    ]
    
    for pattern in track_patterns:
        track_files.extend(glob.glob(pattern))
    
    track_files = [f for f in track_files if not f.endswith('.gif')]
    print(f"Found {len(track_files)} track images")
    
    # Load track images
    track_images = []
    for file_path in track_files:
        img = load_and_preprocess_image(file_path)
        if img is not None:
            track_images.append(img)
    
    track_labels = [1] * len(track_images)
    print(f"Loaded {len(track_images)} track images")
    
    # IMPROVED: Better strategy for non-track images
    # Strategy 1: Use edge regions of track images (less likely to contain tracks)
    non_track_images = []
    print("Creating non-track samples from edge regions...")
    for track_img in track_images:
        # Extract corner patches that typically don't contain track centerlines
        h, w = track_img.shape[:2]
        corners = [
            track_img[:h//3, :w//3],  # Top-left
            track_img[:h//3, 2*w//3:],  # Top-right
            track_img[2*h//3:, :w//3],  # Bottom-left
            track_img[2*h//3:, 2*w//3:],  # Bottom-right
        ]
        
        for corner in corners[:2]:  # Use 2 corners per image
            corner_pil = Image.fromarray((corner * 255).astype(np.uint8))
            resized = corner_pil.resize((IMG_SIZE, IMG_SIZE), Image.Resampling.LANCZOS)
            non_track_images.append(np.array(resized, dtype=np.float32) / 255.0)
    
    # Strategy 2: Heavy augmentation to create very different appearances
    print("Creating augmented non-track samples...")
    for track_img in track_images[:len(track_images)//2]:
        # Extreme rotation to break track patterns
        img_pil = Image.fromarray((track_img * 255).astype(np.uint8))
        for angle in [60, 120]:
            rotated = img_pil.rotate(angle, fillcolor=(128, 128, 128))
            # Crop center to avoid edge artifacts
            crop_size = IMG_SIZE // 2
            center = IMG_SIZE // 2
            cropped = np.array(rotated)[center-crop_size//2:center+crop_size//2, 
                                       center-crop_size//2:center+crop_size//2]
            cropped_pil = Image.fromarray(cropped)
            resized = cropped_pil.resize((IMG_SIZE, IMG_SIZE), Image.Resampling.LANCZOS)
            non_track_images.append(np.array(resized, dtype=np.float32) / 255.0)
    
    non_track_labels = [0] * len(non_track_images)
    print(f"Created {len(non_track_images)} non-track images")
    
    # Combine datasets
    all_images = np.array(track_images + non_track_images)
    all_labels = np.array(track_labels + non_track_labels)
    
    # Shuffle
    all_images, all_labels = shuffle(all_images, all_labels, random_state=42)
    
    # Split into train and validation
    X_train, X_val, y_train, y_val = train_test_split(
        all_images, all_labels, test_size=0.2, random_state=42, stratify=all_labels
    )
    
    print(f"Training set: {len(X_train)} images ({np.sum(y_train==1)} tracks, {np.sum(y_train==0)} non-tracks)")
    print(f"Validation set: {len(X_val)} images ({np.sum(y_val==1)} tracks, {np.sum(y_val==0)} non-tracks)")
    
    return X_train, X_val, y_train, y_val

def create_crack_dataset():
    """Create dataset for crack detection"""
    print("=" * 60)
    print("Creating Crack Detection Dataset")
    print("=" * 60)
    
    cracked_files = []
    normal_files = []
    
    track_patterns = [
        os.path.join(TRACK_IMAGES_DIR, '*.jpg'),
        os.path.join(TRACK_IMAGES_DIR, '*.jpeg'),
        os.path.join(TRACK_IMAGES_DIR, '*.png')
    ]
    
    for pattern in track_patterns:
        for file_path in glob.glob(pattern):
            basename = os.path.basename(file_path).lower()
            if 'crack' in basename and not file_path.endswith('.gif'):
                cracked_files.append(file_path)
            elif 'normal' in basename:
                normal_files.append(file_path)
    
    print(f"Found {len(cracked_files)} cracked track images")
    print(f"Found {len(normal_files)} normal track images")
    
    # Load images
    cracked_images = []
    for file_path in cracked_files:
        img = load_and_preprocess_image(file_path)
        if img is not None:
            cracked_images.append(img)
            
            # IMPROVED: Add augmented versions of cracked images
            # Apply edge enhancement to make cracks more visible
            img_uint8 = (img * 255).astype(np.uint8)
            # Enhance edges
            gray = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            edges_3ch = cv2.cvtColor(edges, cv2.COLOR_GRAY2RGB)
            enhanced = cv2.addWeighted(img_uint8, 0.7, edges_3ch, 0.3, 0)
            cracked_images.append(enhanced.astype(np.float32) / 255.0)
    
    normal_images = []
    for file_path in normal_files:
        img = load_and_preprocess_image(file_path)
        if img is not None:
            normal_images.append(img)
    
    print(f"Loaded {len(cracked_images)} cracked images (with augmentation)")
    print(f"Loaded {len(normal_images)} normal images")
    
    # Create labels
    all_images = np.array(cracked_images + normal_images)
    all_labels = np.array([1] * len(cracked_images) + [0] * len(normal_images))
    
    # Shuffle
    all_images, all_labels = shuffle(all_images, all_labels, random_state=42)
    
    # Split
    X_train, X_val, y_train, y_val = train_test_split(
        all_images, all_labels, test_size=0.2, random_state=42, stratify=all_labels
    )
    
    print(f"Training set: {len(X_train)} images ({np.sum(y_train==1)} cracked, {np.sum(y_train==0)} normal)")
    print(f"Validation set: {len(X_val)} images ({np.sum(y_val==1)} cracked, {np.sum(y_val==0)} normal)")
    
    return X_train, X_val, y_train, y_val

def create_improved_model(name="track_detector", use_deeper=False):
    """
    Create improved model with transfer learning
    Uses InceptionResNetV2 as backbone for superior feature extraction
    """
    # Load pre-trained InceptionResNetV2 (without top layers)
    base_model = keras.applications.InceptionResNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet',
        pooling='avg'  # Global average pooling
    )
    
    # Freeze base model initially
    base_model.trainable = False
    
    # Build model
    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    
    # Data augmentation (only applied during training)
    x = get_augmentation_model()(inputs)
    
    # Preprocessing for InceptionResNetV2 (scale to [-1, 1])
    x = keras.applications.inception_resnet_v2.preprocess_input(x * 255.0)
    
    # Base model
    x = base_model(x, training=False)
    
    # Additional layers for fine-tuning
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.4)(x)
    
    if use_deeper:
        x = layers.Dense(512, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dropout(0.4)(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dropout(0.3)(x)
    else:
        x = layers.Dense(256, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dropout(0.3)(x)
    
    x = layers.Dense(128, activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)
    
    outputs = layers.Dense(1, activation='sigmoid')(x)
    
    model = keras.Model(inputs, outputs, name=name)
    
    # Compile
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=[
            'accuracy',
            keras.metrics.Precision(name='precision'),
            keras.metrics.Recall(name='recall'),
            keras.metrics.AUC(name='auc')
        ]
    )
    
    return model, base_model

def train_model_with_fine_tuning(model, base_model, X_train, y_train, X_val, y_val, 
                                 model_path, epochs, model_name):
    """Train model with two-phase approach: frozen backbone, then fine-tuning"""
    
    # Calculate class weights for imbalanced data
    class_weights = compute_class_weight(
        'balanced',
        classes=np.unique(y_train),
        y=y_train
    )
    class_weight_dict = {i: class_weights[i] for i in range(len(class_weights))}
    print(f"Class weights: {class_weight_dict}")
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=15,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=7,
            min_lr=1e-7,
            verbose=1
        ),
        keras.callbacks.ModelCheckpoint(
            model_path,
            monitor='val_auc',
            save_best_only=True,
            mode='max'
        )
    ]
    
    # Phase 1: Train with frozen backbone
    print("\n" + "="*60)
    print(f"PHASE 1: Training {model_name} with frozen backbone")
    print("="*60)
    
    history1 = model.fit(
        X_train, y_train,
        batch_size=BATCH_SIZE,
        epochs=epochs // 2,
        validation_data=(X_val, y_val),
        class_weight=class_weight_dict,
        callbacks=callbacks,
        verbose=1
    )
    
    # Phase 2: Fine-tune top layers of backbone
    print("\n" + "="*60)
    print(f"PHASE 2: Fine-tuning {model_name}")
    print("="*60)
    
    # Unfreeze top layers of base model
    base_model.trainable = True
    # Freeze early layers, only fine-tune last 50 layers (InceptionResNetV2 has more layers)
    for layer in base_model.layers[:-50]:
        layer.trainable = False
    
    # Count trainable layers
    trainable_count = sum([1 for layer in base_model.layers if layer.trainable])
    print(f"Fine-tuning {trainable_count} layers of InceptionResNetV2")
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.0001),
        loss='binary_crossentropy',
        metrics=[
            'accuracy',
            keras.metrics.Precision(name='precision'),
            keras.metrics.Recall(name='recall'),
            keras.metrics.AUC(name='auc')
        ]
    )
    
    history2 = model.fit(
        X_train, y_train,
        batch_size=BATCH_SIZE,
        epochs=epochs // 2,
        validation_data=(X_val, y_val),
        class_weight=class_weight_dict,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate
    print("\nFinal Evaluation:")
    results = model.evaluate(X_val, y_val, verbose=0)
    print(f"Validation Loss: {results[0]:.4f}")
    print(f"Validation Accuracy: {results[1]:.4f}")
    print(f"Validation Precision: {results[2]:.4f}")
    print(f"Validation Recall: {results[3]:.4f}")
    print(f"Validation AUC: {results[4]:.4f}")
    
    # Calculate F1 score
    y_pred = (model.predict(X_val) > 0.5).astype(int).flatten()
    from sklearn.metrics import f1_score
    f1 = f1_score(y_val, y_pred)
    print(f"Validation F1-Score: {f1:.4f}")
    
    # Save final model
    model.save(model_path)
    print(f"\n✅ Model saved to {model_path}")
    
    return model

def train_crack_model():
    """Train the crack detection model"""
    print("\n" + "=" * 60)
    print("TRAINING CRACK DETECTION MODEL")
    print("=" * 60)
    
    # Create dataset
    X_train, X_val, y_train, y_val = create_crack_dataset()
    
    # Create model (deeper for crack detection)
    model, base_model = create_improved_model(name="crack_detector", use_deeper=True)
    print("\nModel Architecture:")
    model.summary()
    
    # Train
    model = train_model_with_fine_tuning(
        model, base_model, X_train, y_train, X_val, y_val,
        CRACK_MODEL_PATH, EPOCHS_CRACK, "Crack Detector"
    )
    
    return model

if __name__ == '__main__':
    print("=" * 60)
    print("CRACK DETECTION MODEL TRAINING")
    print("=" * 60)
    
    # Check if TrackImages directory exists
    if not os.path.exists(TRACK_IMAGES_DIR):
        print(f"❌ Error: {TRACK_IMAGES_DIR} directory not found!")
        exit(1)
    
    # Train crack detection model (crack vs non-crack)
    crack_model = train_crack_model()
    
    print("\n" + "=" * 60)
    print("✅ TRAINING COMPLETE!")
    print("=" * 60)
    print(f"Crack model saved: {CRACK_MODEL_PATH}")
    print("\nKey improvements applied:")
    print("✓ Transfer learning with InceptionResNetV2 backbone (299x299)")
    print("✓ Data augmentation during training")
    print("✓ Two-phase training (frozen + fine-tuning)")
    print("✓ Class weighting for imbalanced data")
    print("✓ Enhanced evaluation metrics (AUC, F1-score)")
    print("✓ Deeper architecture for better feature learning")