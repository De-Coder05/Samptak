import tensorflow as tf
import os
from tensorflow.keras.layers import (
    Dense, Dropout, GlobalAveragePooling2D,
    BatchNormalization, Input
)
from tensorflow.keras.applications import InceptionResNetV2
from tensorflow.keras.applications.inception_resnet_v2 import preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ReduceLROnPlateau, EarlyStopping, ModelCheckpoint
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

def load_dataset(train_dir, val_dir, test_dir, batch_size=32, img_size=(300, 300)):
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=[0.9, 1.1],
        fill_mode="nearest"
    )

    val_test_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

    train_ds = train_datagen.flow_from_directory(
        train_dir, target_size=img_size,
        batch_size=batch_size, class_mode="binary"
    )

    val_ds = val_test_datagen.flow_from_directory(
        val_dir, target_size=img_size,
        batch_size=batch_size, class_mode="binary"
    )

    test_ds = val_test_datagen.flow_from_directory(
        test_dir, target_size=img_size,
        batch_size=batch_size, class_mode="binary"
    )

    return train_ds, val_ds, test_ds

def build_model(input_shape=(300, 300, 3)):
    inputs = Input(shape=input_shape)
    
    base_model = InceptionResNetV2(
        include_top=False,
        weights="imagenet",
        input_tensor=inputs
    )
    
    # Freeze base model first
    base_model.trainable = False
    
    # Unfreeze last 150 layers for fine-tuning
    for layer in base_model.layers[-150:]:
        layer.trainable = True

    x = base_model.output
    x = GlobalAveragePooling2D()(x)

    # Reduced regularization
    x = Dense(1024, activation='swish', kernel_regularizer=l2(0.0001))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.2)(x)

    x = Dense(512, activation='swish', kernel_regularizer=l2(0.0001))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.2)(x)

    x = Dense(256, activation='swish')(x)
    x = BatchNormalization()(x)

    outputs = Dense(1, activation="sigmoid")(x)

    model = Model(inputs, outputs)
    return model

def main():
    base_dir = "data/processed"
    train_dir = os.path.join(base_dir, "train")
    val_dir = os.path.join(base_dir, "validation")
    test_dir = os.path.join(base_dir, "test")
    
    models_dir = "models"
    os.makedirs(models_dir, exist_ok=True)
    
    batch_size = 32
    img_size = (300, 300)
    
    print("Loading datasets...")
    train_ds, val_ds, test_ds = load_dataset(train_dir, val_dir, test_dir, batch_size, img_size)
    
    print("Building model...")
    model = build_model()
    
    # Use standard Adam for stability on M1/M2 and to avoid attribute errors
    optimizer = Adam(learning_rate=0.0001)
    
    # Use Focal Loss for better handling of class imbalance
    loss_fn = focal_loss(gamma=2.0, alpha=0.25)
    model.compile(optimizer=optimizer, loss=loss_fn, metrics=["accuracy"])
    
    # Callbacks
    reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=2, min_lr=1e-6)
    early_stopping = EarlyStopping(monitor="val_loss", patience=15, restore_best_weights=True)
    checkpoint = ModelCheckpoint(os.path.join(models_dir, "best_model.h5"), monitor="val_loss", save_best_only=True)
    
    print("Starting training...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=100, # Can be stopped early
        callbacks=[reduce_lr, early_stopping, checkpoint]
    )
    
    # Evaluation
    print("Evaluating on test set...")
    loss, accuracy = model.evaluate(test_ds)
    print(f"Test Loss: {loss:.4f}")
    print(f"Test Accuracy: {accuracy:.4f}")
    
    # Save final model as well
    model.save(os.path.join(models_dir, 'final_model.h5'))
    print("Training complete.")

if __name__ == "__main__":
    main()
