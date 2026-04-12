"""
EchoSense — Gesture Sequence Collector
=======================================
Opens the webcam, runs MediaPipe Hands, and records fixed-length landmark
sequences for a single gesture label.

Usage:
    python model/collect_gestures.py <label> [--sequences N] [--frames F]

Examples:
    python model/collect_gestures.py hello
    python model/collect_gestures.py thank_you --sequences 40
    python model/collect_gestures.py please --sequences 30 --frames 30

Arguments:
    label          Name of the gesture (used as the folder name)
    --sequences    How many sequences to record  (default: 30)
    --frames       Frames per sequence           (default: 30)

Output:
    model/data/sequences/<label>/0.npy
    model/data/sequences/<label>/1.npy
    ...

Each .npy file is a float32 array of shape (frames, 63):
    21 landmarks × (x, y, z) = 63 features per frame.
    Coordinates are in MediaPipe normalized form [0.0, 1.0].

Controls (during recording):
    SPACE — start next sequence immediately (skip countdown)
    Q / ESC — quit
"""

import argparse
import os
import sys
import time

import cv2
import mediapipe as mp
import numpy as np

# ── Constants ─────────────────────────────────────────────────────────────────
SEQ_DIR       = os.path.join(os.path.dirname(__file__), 'data', 'sequences')
COUNTDOWN_SEC = 2      # pause between sequences
FONT          = cv2.FONT_HERSHEY_SIMPLEX

# MediaPipe
mp_hands    = mp.solutions.hands
mp_drawing  = mp.solutions.drawing_utils
mp_styles   = mp.solutions.drawing_styles


# ── Helpers ───────────────────────────────────────────────────────────────────
def extract_landmarks(result) -> np.ndarray | None:
    """Return (63,) float32 array from the first detected hand, or None."""
    if not result.multi_hand_landmarks:
        return None
    lm = result.multi_hand_landmarks[0].landmark
    return np.array([[l.x, l.y, l.z] for l in lm], dtype=np.float32).flatten()


def overlay_text(frame, lines: list[tuple[str, tuple, float, int, tuple]]):
    """Draw multiple text lines with background rectangles for legibility."""
    for text, origin, scale, thickness, color in lines:
        (tw, th), bl = cv2.getTextSize(text, FONT, scale, thickness)
        x, y = origin
        cv2.rectangle(frame, (x - 4, y - th - 4), (x + tw + 4, y + bl + 4),
                       (0, 0, 0), cv2.FILLED)
        cv2.putText(frame, text, origin, FONT, scale, color, thickness, cv2.LINE_AA)


# ── Main ──────────────────────────────────────────────────────────────────────
def collect(label: str, n_sequences: int, n_frames: int):
    out_dir = os.path.join(SEQ_DIR, label)
    os.makedirs(out_dir, exist_ok=True)

    # Find highest existing sequence index so we can append, not overwrite
    existing = [
        int(f.replace('.npy', ''))
        for f in os.listdir(out_dir)
        if f.endswith('.npy') and f.replace('.npy', '').isdigit()
    ]
    start_idx = max(existing) + 1 if existing else 0
    end_idx   = start_idx + n_sequences

    print(f"\n{'=' * 52}")
    print(f"  EchoSense — collect_gestures.py")
    print(f"{'=' * 52}")
    print(f"  Label      : {label}")
    print(f"  Sequences  : {n_sequences}  (#{start_idx} → #{end_idx - 1})")
    print(f"  Frames/seq : {n_frames}")
    print(f"  Output dir : {out_dir}")
    print(f"{'=' * 52}")
    print("\nControls:  SPACE = skip countdown   Q/ESC = quit\n")

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Cannot open webcam.")
        sys.exit(1)

    with mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.5,
    ) as hands:

        for seq_idx in range(start_idx, end_idx):
            # ── Countdown ────────────────────────────────────────────────────
            deadline = time.time() + COUNTDOWN_SEC
            while time.time() < deadline:
                ok, frame = cap.read()
                if not ok:
                    break
                frame = cv2.flip(frame, 1)
                remaining = deadline - time.time()
                h, w = frame.shape[:2]

                overlay_text(frame, [
                    (f"Gesture: {label}", (10, 30), 0.8, 2, (100, 255, 180)),
                    (f"Seq {seq_idx}/{end_idx - 1}  —  Get ready...",
                     (10, 65), 0.65, 1, (255, 255, 255)),
                    (f"Starting in {remaining:.1f}s  [SPACE to skip]",
                     (10, 95), 0.6, 1, (200, 200, 200)),
                ])
                cv2.imshow("EchoSense — Collect Gestures", frame)
                key = cv2.waitKey(1) & 0xFF
                if key in (ord('q'), 27):
                    print("\nQuit.")
                    cap.release()
                    cv2.destroyAllWindows()
                    return
                if key == ord(' '):
                    break

            # ── Record sequence ───────────────────────────────────────────────
            sequence = []
            frame_idx = 0

            while frame_idx < n_frames:
                ok, frame = cap.read()
                if not ok:
                    break
                frame = cv2.flip(frame, 1)
                rgb   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                result = hands.process(rgb)

                # Draw landmarks
                if result.multi_hand_landmarks:
                    for hand_lm in result.multi_hand_landmarks:
                        mp_drawing.draw_landmarks(
                            frame, hand_lm,
                            mp_hands.HAND_CONNECTIONS,
                            mp_styles.get_default_hand_landmarks_style(),
                            mp_styles.get_default_hand_connections_style(),
                        )

                landmarks = extract_landmarks(result)
                if landmarks is not None:
                    sequence.append(landmarks)
                    frame_idx += 1
                    # Green progress bar
                    bar_w = int(frame.shape[1] * frame_idx / n_frames)
                    cv2.rectangle(frame, (0, frame.shape[0] - 8),
                                  (bar_w, frame.shape[0]), (50, 200, 100), cv2.FILLED)

                hand_status = "Hand detected" if landmarks is not None else "No hand — waiting..."
                color       = (50, 220, 100) if landmarks is not None else (50, 100, 255)

                overlay_text(frame, [
                    (f"RECORDING  seq {seq_idx}/{end_idx - 1}", (10, 30), 0.8, 2, (50, 50, 255)),
                    (f"Gesture: {label}", (10, 65), 0.7, 1, (255, 255, 255)),
                    (f"Frame {frame_idx}/{n_frames}  —  {hand_status}",
                     (10, 95), 0.6, 1, color),
                ])
                cv2.imshow("EchoSense — Collect Gestures", frame)
                key = cv2.waitKey(1) & 0xFF
                if key in (ord('q'), 27):
                    print("\nQuit.")
                    cap.release()
                    cv2.destroyAllWindows()
                    return

            # ── Save ─────────────────────────────────────────────────────────
            if len(sequence) == n_frames:
                arr = np.array(sequence, dtype=np.float32)   # (30, 63)
                np.save(os.path.join(out_dir, f"{seq_idx}.npy"), arr)
                print(f"  [OK] seq {seq_idx:>3}  shape={arr.shape}  → {out_dir}/{seq_idx}.npy")
            else:
                print(f"  [SKIP] seq {seq_idx} — only {len(sequence)} frames captured, discarding.")

    cap.release()
    cv2.destroyAllWindows()

    total = len([f for f in os.listdir(out_dir) if f.endswith('.npy')])
    print(f"\n{'=' * 52}")
    print(f"  Done. {n_sequences} new sequences recorded.")
    print(f"  Total sequences for '{label}': {total}")
    print(f"{'=' * 52}\n")


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Record MediaPipe hand landmark sequences for a gesture label."
    )
    parser.add_argument('label',
                        help="Gesture name, e.g. 'hello', 'thank_you'")
    parser.add_argument('--sequences', type=int, default=30,
                        help="Number of sequences to record (default: 30)")
    parser.add_argument('--frames', type=int, default=30,
                        help="Frames per sequence (default: 30)")
    args = parser.parse_args()

    collect(
        label=args.label,
        n_sequences=args.sequences,
        n_frames=args.frames,
    )
