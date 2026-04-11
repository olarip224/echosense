// Path where trained models will be placed.
// Drop model.json + weight shards here when ready.
export const CNN_MODEL_PATH = '/models/cnn/model.json'

export const LSTM_MODEL_PATH = '/models/lstm/model.json'

// ASL alphabet in training order.
// This MUST match the order used during model training — do not reorder.
export const CNN_LABELS: string[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
  'SPACE', 'DELETE', 'NOTHING',
]

// Dynamic gesture labels in training order.
// Must match LSTM training label order exactly.
export const LSTM_LABELS: string[] = [
  'hello', 'thank_you', 'please', 'sorry', 'help',
  'more', 'finished', 'want', 'understand', 'where',
  'name', 'pain', 'water', 'eat', 'friend',
]

// Minimum confidence to accept a CNN prediction.
// Below this threshold the classifier returns null.
export const CNN_CONFIDENCE_THRESHOLD = 0.75

// Minimum confidence for LSTM gesture acceptance.
export const LSTM_CONFIDENCE_THRESHOLD = 0.82

// Number of landmark frames the LSTM expects.
// Must match sequence length used in training.
export const LSTM_SEQUENCE_LENGTH = 30

// Number of features per frame:
// 21 landmarks × 3 coordinates (x, y, z) = 63
export const LANDMARK_FEATURE_COUNT = 63
