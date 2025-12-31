# Training Instructions for Improved Models

## Overview
Your training script has been improved with:
- **MobileNetV2 Transfer Learning** - Better feature extraction
- **224x224 Image Size** - Optimized for MobileNetV2
- **Two-Phase Training** - Frozen backbone + fine-tuning
- **Data Augmentation** - Better generalization
- **Class Weighting** - Handles imbalanced datasets
- **Enhanced Metrics** - AUC, F1-score for better evaluation

## Current Status
- ✅ Training script updated (`train_models.py`)
- ✅ Application code adapted to handle MobileNetV2 models
- ✅ Preprocessing matches training pipeline
- ⏳ Models need to be retrained with new script

## Training the Models

### Step 1: Run Training
```bash
python train_models.py
```

This will:
1. Load 118 track images from `TrackImages/` folder
2. Create non-track samples using improved strategies
3. Train track detection model (MobileNetV2-based)
4. Train crack detection model (MobileNetV2-based)
5. Save models as `track_model.keras` and `crack_model.keras`

### Step 2: Training Time
- **Track Model**: ~50-100 epochs (with early stopping)
- **Crack Model**: ~50-100 epochs (with early stopping)
- **Total Time**: ~30-60 minutes (depending on hardware)

### Step 3: After Training
Once training completes:
```bash
# Restart backend to load new models
docker-compose restart backend
```

## Model Improvements

### Track Detection Model
- **Architecture**: MobileNetV2 backbone + custom head
- **Input**: 224x224x3
- **Preprocessing**: MobileNetV2 standard ([-1, 1] range)
- **Expected Accuracy**: 85-95%

### Crack Detection Model  
- **Architecture**: MobileNetV2 backbone + deeper head
- **Input**: 224x224x3
- **Preprocessing**: MobileNetV2 standard ([-1, 1] range)
- **Expected Accuracy**: 90-95%

## Application Adaptations

The application (`app.py`) has been updated to:
- ✅ Automatically detect model input size (224x224 or 300x300)
- ✅ Apply correct preprocessing (MobileNetV2 or standard)
- ✅ Detect if models are trained (MobileNetV2) vs fallback
- ✅ Adjust confidence thresholds based on model type
- ✅ Handle both old (300x300) and new (224x224) models

## Key Features

### Better Negative Samples
- Uses edge regions of track images
- Heavy augmentation to break track patterns
- More realistic non-track samples

### Enhanced Crack Detection
- Edge enhancement for cracked images
- Better augmentation strategies
- Deeper model architecture

### Two-Phase Training
1. **Phase 1**: Train with frozen MobileNetV2 backbone
2. **Phase 2**: Fine-tune top layers of backbone
3. Better convergence and accuracy

## Monitoring Training

Watch training progress:
```bash
# If training in background
tail -f training_final.log

# Check for completion
ls -lh track_model.keras crack_model.keras
```

## Expected Results

After training with MobileNetV2:
- **Track Detection**: Much better at distinguishing tracks from non-tracks
- **Crack Detection**: More accurate crack identification
- **Confidence**: Higher confidence scores for correct predictions
- **Robustness**: Better handling of various image conditions

## Troubleshooting

If models don't load:
1. Check model files exist: `ls -lh *.keras`
2. Check model input shape matches (should be 224x224)
3. Verify preprocessing matches training
4. Check backend logs: `docker-compose logs backend`

## Next Steps

1. **Train Models**: Run `python train_models.py`
2. **Wait for Completion**: Monitor training progress
3. **Restart Backend**: `docker-compose restart backend`
4. **Test**: Upload images to verify improved accuracy

The application is ready to use the improved MobileNetV2 models once training completes!

