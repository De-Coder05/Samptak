# Model Training Guide

## Overview
This project includes a training script (`train_models.py`) that trains two separate models:
1. **Track Detection Model** - Distinguishes railway track images from non-track images
2. **Crack Detection Model** - Detects cracks in railway track images

## Dataset
- **Location**: `TrackImages/` folder
- **Track Images**: 118 images (mix of cracked and normal tracks)
- **Cracked Images**: ~60 images (prefixed with `cracked_`)
- **Normal Images**: ~60 images (prefixed with `normal_`)

## Training Process

### Running Training
```bash
python train_models.py
```

The script will:
1. Load all track images from `TrackImages/` folder
2. Create non-track samples through data augmentation
3. Train the track detection model
4. Train the crack detection model using cracked vs normal track images
5. Save trained models to:
   - `track_model.keras`
   - `crack_model.keras`

### Training Configuration
- **Image Size**: 300x300 pixels
- **Batch Size**: 32
- **Epochs**: 50 (with early stopping)
- **Optimizer**: Adam (learning rate: 0.001)
- **Validation Split**: 20%

### Model Architectures

#### Track Detection Model
- 4 Convolutional blocks (32→64→128→256 filters)
- BatchNormalization and Dropout for regularization
- GlobalAveragePooling2D
- Dense layers (512→256→1)
- Total parameters: ~655K

#### Crack Detection Model
- 5 Convolutional blocks (32→64→128→256→512 filters)
- Deeper architecture for fine-grained crack detection
- Similar regularization techniques
- Total parameters: ~1.2M

## After Training

Once training completes:
1. The trained models will be saved automatically
2. Restart the Docker containers to use the new models:
   ```bash
   docker-compose restart backend
   ```
3. The application will automatically load the trained models

## Monitoring Training

Check training progress:
```bash
tail -f training_output.log
```

Or if training in foreground, you'll see real-time metrics:
- Loss (should decrease)
- Accuracy (should increase)
- Precision and Recall

## Expected Results

After training, you should see:
- **Track Detection**: 80-95% accuracy
- **Crack Detection**: 85-95% accuracy

The models will be much more reliable than the untrained versions!

