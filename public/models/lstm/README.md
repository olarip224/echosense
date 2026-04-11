# LSTM Model — ASL Dynamic Gesture Classifier

Drop your trained TensorFlow.js model files here:
- model.json
- group1-shard1of1.bin

## How to train
1. Record 30 sequences × 30 frames for each gesture
   using: python scripts/collect_gestures.py [label]
2. Run: python scripts/train_lstm.py
3. Export to TensorFlow.js format
4. Drop files here — LSTM activates automatically

## Model input
- Shape: [1, 30, 63]
- 30 frames × 21 landmarks × 3 coordinates (x,y,z)
- Labels must match LSTM_LABELS in modelConfig.ts

## Gestures supported
hello, thank_you, please, sorry, help, more,
finished, want, understand, where, name,
pain, water, eat, friend
