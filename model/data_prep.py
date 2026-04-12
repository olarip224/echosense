"""
EchoSense — ASL Dataset Preparation
====================================
Loads images from model/data/train (organized in class subfolders A-Z,
SPACE, DELETE, NOTHING), resizes to 224×224, normalizes to [0,1], and
creates augmented train + validation generators.

Usage:
    python model/data_prep.py

Expected folder layout BEFORE running:
    model/data/train/
        A/   (images)
        B/   (images)
        ...
        Z/
        SPACE/
        DELETE/
        NOTHING/

After running, model/data/val/ is populated automatically via the
validation split inside ImageDataGenerator.

Dataset source (Kaggle):
    kaggle datasets download -d grassknoted/asl-alphabet
    unzip asl-alphabet.zip -d model/data/train
"""

import os
import sys
import numpy as np
import matplotlib
matplotlib.use('Agg')           # headless — no display required
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ── Constants ─────────────────────────────────────────────────────────────────
TRAIN_DIR    = os.path.join(os.path.dirname(__file__), 'data', 'train')
VAL_DIR      = os.path.join(os.path.dirname(__file__), 'data', 'val')
IMG_SIZE     = (224, 224)
BATCH_SIZE   = 32
VAL_SPLIT    = 0.2
RANDOM_SEED  = 42

EXPECTED_CLASSES = (
    list('ABCDEFGHIJKLMNOPQRSTUVWXYZ') + ['SPACE', 'DELETE', 'NOTHING']
)


# ── Validate train directory ──────────────────────────────────────────────────
def check_train_dir():
    if not os.path.isdir(TRAIN_DIR):
        print(f"\n[ERROR] Train directory not found: {TRAIN_DIR}")
        print("\nTo download the dataset run:")
        print("  kaggle datasets download -d grassknoted/asl-alphabet")
        print("  unzip asl-alphabet.zip -d model/data/train\n")
        sys.exit(1)

    subdirs = [d for d in os.listdir(TRAIN_DIR)
               if os.path.isdir(os.path.join(TRAIN_DIR, d))]
    if len(subdirs) == 0:
        print(f"\n[ERROR] No class subfolders found in {TRAIN_DIR}")
        print("Each class (A-Z, SPACE, DELETE, NOTHING) needs its own subfolder.\n")
        sys.exit(1)

    return sorted(subdirs)


# ── Count images per class ────────────────────────────────────────────────────
def count_images(base_dir, classes):
    counts = {}
    for cls in classes:
        cls_path = os.path.join(base_dir, cls)
        if not os.path.isdir(cls_path):
            counts[cls] = 0
            continue
        files = [
            f for f in os.listdir(cls_path)
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))
        ]
        counts[cls] = len(files)
    return counts


# ── Build generators ──────────────────────────────────────────────────────────
def build_generators():
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        rotation_range=10,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=False,   # ASL is hand-orientation-specific — no flip
        fill_mode='nearest',
        validation_split=VAL_SPLIT,
    )

    # Validation: only rescale, no augmentation
    val_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        validation_split=VAL_SPLIT,
    )

    train_gen = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        seed=RANDOM_SEED,
        shuffle=True,
    )

    val_gen = val_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        seed=RANDOM_SEED,
        shuffle=False,
    )

    return train_gen, val_gen


# ── Print statistics ──────────────────────────────────────────────────────────
def print_statistics(classes, counts, train_gen, val_gen):
    total = sum(counts.values())
    n_train = train_gen.samples
    n_val   = val_gen.samples
    n_classes = len(train_gen.class_indices)

    print("\n" + "=" * 52)
    print("  EchoSense — Dataset Statistics")
    print("=" * 52)
    print(f"  Train directory : {TRAIN_DIR}")
    print(f"  Image size      : {IMG_SIZE[0]} × {IMG_SIZE[1]} px")
    print(f"  Batch size      : {BATCH_SIZE}")
    print(f"  Val split       : {int(VAL_SPLIT * 100)}%")
    print(f"  Classes found   : {n_classes}")
    print(f"  Total images    : {total:,}")
    print(f"  Train samples   : {n_train:,}")
    print(f"  Val samples     : {n_val:,}")
    print("-" * 52)
    print(f"  {'Class':<12} {'Images':>8}  {'Bar'}")
    print("-" * 52)

    max_count = max(counts.values()) if counts else 1
    bar_width  = 24

    for cls in classes:
        c = counts.get(cls, 0)
        bar_len = int(bar_width * c / max_count) if max_count > 0 else 0
        bar = '█' * bar_len
        flag = '  ← MISSING' if c == 0 else ''
        print(f"  {cls:<12} {c:>8}  {bar}{flag}")

    print("=" * 52)

    # Sample shape check
    sample_x, sample_y = next(train_gen)
    print(f"\n  Sample batch shape : {sample_x.shape}")
    print(f"  Label batch shape  : {sample_y.shape}")
    print(f"  Pixel range        : [{sample_x.min():.3f}, {sample_x.max():.3f}]")
    print(f"  Class index map    : {train_gen.class_indices}\n")

    # Check for missing expected classes
    missing = [c for c in EXPECTED_CLASSES if counts.get(c, 0) == 0]
    if missing:
        print(f"  [WARN] Missing classes: {missing}")
        print("  These will not appear in the trained model.\n")
    else:
        print("  [OK] All 29 expected classes are present.\n")

    return train_gen, val_gen


# ── Optional: save a class distribution chart ─────────────────────────────────
def save_distribution_chart(classes, counts):
    out_path = os.path.join(os.path.dirname(__file__), 'saved', 'class_distribution.png')
    fig, ax = plt.subplots(figsize=(16, 5))
    ax.bar(classes, [counts.get(c, 0) for c in classes], color='#1D9E75', edgecolor='white')
    ax.set_title('ASL Dataset — Class Distribution', fontsize=14, fontweight='bold')
    ax.set_xlabel('Class')
    ax.set_ylabel('Image Count')
    ax.tick_params(axis='x', rotation=45)
    plt.tight_layout()
    plt.savefig(out_path, dpi=120)
    plt.close()
    print(f"  Chart saved → {out_path}")


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("\nEchoSense — data_prep.py")
    print("Checking dataset...")

    classes = check_train_dir()
    counts  = count_images(TRAIN_DIR, classes)

    print(f"Found {len(classes)} class folders. Building generators...")
    train_gen, val_gen = build_generators()

    print_statistics(classes, counts, train_gen, val_gen)
    save_distribution_chart(classes, counts)

    # Return generators so train_cnn.py can import this module
    return train_gen, val_gen


if __name__ == '__main__':
    main()
