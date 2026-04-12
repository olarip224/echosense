"""
EchoSense — CNN Training Script
=================================
Transfer learning with MobileNetV2 on the ASL Alphabet dataset.

Phase 1 — Feature extraction (10 epochs):
  MobileNetV2 base frozen, only top layers trained.

Phase 2 — Fine-tuning (5 epochs):
  Top 30 base layers unfrozen, lower learning rate.

Usage:
    python model/train_cnn.py

Outputs (all saved to model/saved/):
    asl_cnn_best.h5          — best checkpoint by val_accuracy
    asl_cnn_final.h5         — weights after full training
    training_curves.png      — loss + accuracy plots
    tfjs_model/              — TensorFlow.js export (drop into public/models/cnn/)
    class_indices.json       — label → index mapping used during training
"""

import os
import sys
import json
import subprocess

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dropout, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard
)

# ── Paths ─────────────────────────────────────────────────────────────────────
MODEL_DIR  = os.path.dirname(__file__)
SAVED_DIR  = os.path.join(MODEL_DIR, 'saved')
TFJS_DIR   = os.path.join(SAVED_DIR, 'tfjs_model')
BEST_H5    = os.path.join(SAVED_DIR, 'asl_cnn_best.h5')
FINAL_H5   = os.path.join(SAVED_DIR, 'asl_cnn_final.h5')
CURVES_PNG = os.path.join(SAVED_DIR, 'training_curves.png')
INDEX_JSON = os.path.join(SAVED_DIR, 'class_indices.json')

os.makedirs(SAVED_DIR, exist_ok=True)

# ── Hyper-parameters ──────────────────────────────────────────────────────────
IMG_SIZE       = (224, 224)
NUM_CLASSES    = 29
BATCH_SIZE     = 32
PHASE1_EPOCHS  = 10
PHASE2_EPOCHS  = 5
LR_PHASE1      = 1e-3
LR_PHASE2      = 1e-4
UNFREEZE_LAYERS = 30   # top N layers of MobileNetV2 to unfreeze in phase 2


# ── 1. Load dataset via data_prep.py ─────────────────────────────────────────
print("\n" + "=" * 56)
print("  EchoSense — train_cnn.py")
print("=" * 56)
print("\n[1/5] Loading dataset via data_prep.py ...")

sys.path.insert(0, MODEL_DIR)
from data_prep import build_generators, TRAIN_DIR

train_gen, val_gen = build_generators()

print(f"      Train batches : {len(train_gen)}")
print(f"      Val batches   : {len(val_gen)}")
print(f"      Classes       : {train_gen.num_classes}")

# Save class index map so the app can verify label order
with open(INDEX_JSON, 'w') as f:
    json.dump(train_gen.class_indices, f, indent=2)
print(f"      Class indices saved → {INDEX_JSON}")


# ── 2. Build model ────────────────────────────────────────────────────────────
print("\n[2/5] Building MobileNetV2 transfer learning model ...")

base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(*IMG_SIZE, 3),
)
base_model.trainable = False   # freeze all base layers for phase 1

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.3)(x)
predictions = Dense(NUM_CLASSES, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

print(f"      Base layers   : {len(base_model.layers)}")
print(f"      Total params  : {model.count_params():,}")
print(f"      Trainable     : {sum(tf.size(v).numpy() for v in model.trainable_variables):,}")


# ── 3. Phase 1 — feature extraction ──────────────────────────────────────────
print(f"\n[3/5] Phase 1 — feature extraction ({PHASE1_EPOCHS} epochs, lr={LR_PHASE1}) ...")

model.compile(
    optimizer=Adam(learning_rate=LR_PHASE1),
    loss='categorical_crossentropy',
    metrics=['accuracy'],
)

callbacks_phase1 = [
    ModelCheckpoint(
        filepath=BEST_H5,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1,
    ),
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=2,
        min_lr=1e-6,
        verbose=1,
    ),
    EarlyStopping(
        monitor='val_accuracy',
        patience=4,
        restore_best_weights=True,
        verbose=1,
    ),
]

history1 = model.fit(
    train_gen,
    epochs=PHASE1_EPOCHS,
    validation_data=val_gen,
    callbacks=callbacks_phase1,
    verbose=1,
)

p1_best_val_acc = max(history1.history['val_accuracy'])
print(f"\n      Phase 1 best val_accuracy : {p1_best_val_acc:.4f}")


# ── 4. Phase 2 — fine-tuning top layers ──────────────────────────────────────
print(f"\n[4/5] Phase 2 — fine-tuning top {UNFREEZE_LAYERS} base layers "
      f"({PHASE2_EPOCHS} epochs, lr={LR_PHASE2}) ...")

# Unfreeze top N layers of the base model
base_model.trainable = True
for layer in base_model.layers[:-UNFREEZE_LAYERS]:
    layer.trainable = False

trainable_count = sum(tf.size(v).numpy() for v in model.trainable_variables)
print(f"      Trainable params after unfreeze : {trainable_count:,}")

model.compile(
    optimizer=Adam(learning_rate=LR_PHASE2),
    loss='categorical_crossentropy',
    metrics=['accuracy'],
)

callbacks_phase2 = [
    ModelCheckpoint(
        filepath=BEST_H5,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1,
    ),
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=2,
        min_lr=1e-7,
        verbose=1,
    ),
    EarlyStopping(
        monitor='val_accuracy',
        patience=4,
        restore_best_weights=True,
        verbose=1,
    ),
]

history2 = model.fit(
    train_gen,
    epochs=PHASE2_EPOCHS,
    validation_data=val_gen,
    callbacks=callbacks_phase2,
    verbose=1,
)

# Save final weights
model.save(FINAL_H5)
print(f"\n      Final model saved → {FINAL_H5}")

# ── 5. Training curves ────────────────────────────────────────────────────────
print(f"\n[5/5] Saving training curves → {CURVES_PNG} ...")

# Concatenate phase 1 + phase 2 histories
def concat(key):
    return history1.history[key] + history2.history[key]

acc      = concat('accuracy')
val_acc  = concat('val_accuracy')
loss     = concat('loss')
val_loss = concat('val_loss')
epochs   = range(1, len(acc) + 1)
p1_end   = PHASE1_EPOCHS  # vertical divider between phases

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle('EchoSense — MobileNetV2 ASL Classifier Training', fontsize=14, fontweight='bold')

# Accuracy
ax1.plot(epochs, acc,     '#1D9E75', linewidth=2,  label='Train accuracy')
ax1.plot(epochs, val_acc, '#0F6E56', linewidth=2,  label='Val accuracy', linestyle='--')
ax1.axvline(x=p1_end + 0.5, color='#94a3b8', linestyle=':', linewidth=1.5, label='Fine-tune start')
ax1.set_title('Accuracy')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Accuracy')
ax1.legend()
ax1.set_ylim([0, 1])
ax1.grid(True, alpha=0.3)

# Loss
ax2.plot(epochs, loss,     '#F0A876', linewidth=2,  label='Train loss')
ax2.plot(epochs, val_loss, '#D4784E', linewidth=2,  label='Val loss', linestyle='--')
ax2.axvline(x=p1_end + 0.5, color='#94a3b8', linestyle=':', linewidth=1.5, label='Fine-tune start')
ax2.set_title('Loss')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Loss')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig(CURVES_PNG, dpi=150)
plt.close()

# ── Results summary ───────────────────────────────────────────────────────────
final_val_acc  = val_acc[-1]
best_val_acc   = max(val_acc)
final_val_loss = val_loss[-1]

print("\n" + "=" * 56)
print("  Training Complete")
print("=" * 56)
print(f"  Phase 1 best val_accuracy  : {p1_best_val_acc:.4f}")
print(f"  Phase 2 best val_accuracy  : {max(history2.history['val_accuracy']):.4f}")
print(f"  Overall best val_accuracy  : {best_val_acc:.4f}")
print(f"  Final val_accuracy         : {final_val_acc:.4f}")
print(f"  Final val_loss             : {final_val_loss:.4f}")
print(f"  Best model checkpoint      : {BEST_H5}")
print(f"  Training curves            : {CURVES_PNG}")
print("=" * 56)

# ── TensorFlow.js export ──────────────────────────────────────────────────────
print(f"\nExporting to TensorFlow.js format → {TFJS_DIR} ...")
os.makedirs(TFJS_DIR, exist_ok=True)

result = subprocess.run(
    [
        'tensorflowjs_converter',
        '--input_format=keras',
        BEST_H5,
        TFJS_DIR,
    ],
    capture_output=True,
    text=True,
)

if result.returncode == 0:
    tfjs_files = os.listdir(TFJS_DIR)
    print(f"\n  [OK] TF.js export successful. Files:")
    for f in sorted(tfjs_files):
        size = os.path.getsize(os.path.join(TFJS_DIR, f))
        print(f"       {f:<40} {size/1024/1024:.2f} MB")
    print(f"\n  Next step: copy {TFJS_DIR}/ contents to")
    print(f"  echosense/public/models/cnn/")
    print(f"  then refresh the app — CNN activates automatically.\n")
else:
    print(f"\n  [ERROR] TF.js conversion failed:")
    print(result.stderr)
    print(f"\n  Run manually:")
    print(f"  tensorflowjs_converter --input_format=keras {BEST_H5} {TFJS_DIR}\n")
