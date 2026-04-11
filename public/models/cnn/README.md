# CNN Model — ASL Static Sign Classifier

Drop your trained TensorFlow.js model files here:
- model.json
- group1-shard1of1.bin (or multiple shards)

## How to train
1. Download ASL Alphabet dataset from Kaggle
   (search: "ASL Alphabet" by akash8184 — 87,000 images)
2. Run: python scripts/train_cnn.py
3. Export: tensorflowjs_converter --input_format=keras
   asl_cnn.h5 public/models/cnn/
4. Refresh the app — CNN classifier activates automatically

## Model input
- Image size: 224 × 224 × 3
- Normalization: pixel values / 255
- Output: 29 classes (A-Z + SPACE + DELETE + NOTHING)

## Expected accuracy
- Target: >90% validation accuracy
- Architecture: MobileNetV2 fine-tuned
