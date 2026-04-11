// Finger state for each gesture: [thumb, index, middle, ring, pinky]
// true = extended/up, false = curled/down
// 'side' = thumb pointing sideways (for horizontal gestures)

export type FingerState = boolean | 'side' | 'cross'

export interface HandState {
  thumb: FingerState
  index: FingerState
  middle: FingerState
  ring: FingerState
  pinky: FingerState
  /** Optional: rotate the whole hand for sideways pointing gestures */
  rotate?: number
  note?: string
}

export const HAND_STATES: Record<string, HandState> = {
  // ── Quick responses ──────────────────────────────────────────────────────
  Thumb_Up:     { thumb: true,   index: false, middle: false, ring: false, pinky: false },
  Thumb_Down:   { thumb: 'side', index: false, middle: false, ring: false, pinky: false, rotate: 180 },
  Open_Palm:    { thumb: true,   index: true,  middle: true,  ring: true,  pinky: true  },
  Closed_Fist:  { thumb: false,  index: false, middle: false, ring: false, pinky: false },
  Victory:      { thumb: false,  index: true,  middle: true,  ring: false, pinky: false },
  ILoveYou:     { thumb: true,   index: true,  middle: false, ring: false, pinky: true  },
  Pointing_Up:  { thumb: false,  index: true,  middle: false, ring: false, pinky: false },

  // ── Alphabet A–F ─────────────────────────────────────────────────────────
  ASL_A: { thumb: 'side', index: false, middle: false, ring: false, pinky: false },
  ASL_B: { thumb: false,  index: true,  middle: true,  ring: true,  pinky: true  },
  ASL_C: { thumb: 'side', index: 'side', middle: 'side', ring: 'side', pinky: 'side', note: 'curve' },
  ASL_D: { thumb: false,  index: true,  middle: false, ring: false, pinky: false, note: 'D' },
  ASL_E: { thumb: false,  index: false, middle: false, ring: false, pinky: false, note: 'claw' },
  ASL_F: { thumb: false,  index: false, middle: true,  ring: true,  pinky: true,  note: 'F' },

  // ── Alphabet G–M ─────────────────────────────────────────────────────────
  ASL_G: { thumb: 'side', index: 'side', middle: false, ring: false, pinky: false },
  ASL_H: { thumb: false,  index: 'side', middle: 'side', ring: false, pinky: false },
  ASL_I: { thumb: false,  index: false, middle: false, ring: false, pinky: true  },
  ASL_K: { thumb: true,   index: true,  middle: true,  ring: false, pinky: false, note: 'K' },
  ASL_L: { thumb: true,   index: true,  middle: false, ring: false, pinky: false },
  ASL_M: { thumb: false,  index: false, middle: false, ring: false, pinky: false, note: 'M' },

  // ── Alphabet N–Z ─────────────────────────────────────────────────────────
  ASL_N: { thumb: false,  index: false, middle: false, ring: false, pinky: false, note: 'N' },
  ASL_O: { thumb: false,  index: false, middle: false, ring: false, pinky: false, note: 'O' },
  ASL_R: { thumb: false,  index: 'cross', middle: 'cross', ring: false, pinky: false },
  ASL_S: { thumb: false,  index: false, middle: false, ring: false, pinky: false, note: 'S' },
  ASL_U: { thumb: false,  index: true,  middle: true,  ring: false, pinky: false },
  ASL_W: { thumb: false,  index: true,  middle: true,  ring: true,  pinky: false },
  ASL_Y: { thumb: true,   index: false, middle: false, ring: false, pinky: true  },

  // ── Numbers 0–5 ──────────────────────────────────────────────────────────
  ASL_0: { thumb: false,  index: false, middle: false, ring: false, pinky: false, note: 'O' },
  ASL_1: { thumb: false,  index: true,  middle: false, ring: false, pinky: false },
  ASL_2: { thumb: false,  index: true,  middle: true,  ring: false, pinky: false },
  ASL_3: { thumb: true,   index: true,  middle: true,  ring: false, pinky: false },
  ASL_4: { thumb: false,  index: true,  middle: true,  ring: true,  pinky: true  },
  ASL_5: { thumb: true,   index: true,  middle: true,  ring: true,  pinky: true  },

  // ── Numbers 6–9 ──────────────────────────────────────────────────────────
  ASL_6: { thumb: false,  index: true,  middle: true,  ring: true,  pinky: false, note: '6' },
  ASL_7: { thumb: false,  index: true,  middle: true,  ring: false, pinky: true,  note: '7' },
  ASL_8: { thumb: false,  index: true,  middle: false, ring: true,  pinky: true,  note: '8' },
  ASL_9: { thumb: false,  index: false, middle: true,  ring: true,  pinky: true,  note: '9' },

  // ── Common phrases ────────────────────────────────────────────────────────
  ASL_PLEASE:   { thumb: true,  index: true,  middle: true,  ring: true,  pinky: true,  note: 'chest' },
  ASL_THANKYOU: { thumb: true,  index: true,  middle: true,  ring: true,  pinky: true,  note: 'chin' },
  ASL_SORRY:    { thumb: false, index: false, middle: false, ring: false, pinky: false, note: 'chest' },
  ASL_HELP:     { thumb: true,  index: false, middle: false, ring: false, pinky: false, note: 'lift' },
  ASL_MORE:     { thumb: false, index: false, middle: false, ring: false, pinky: false, note: 'both' },
  ASL_FINISHED: { thumb: true,  index: true,  middle: true,  ring: true,  pinky: true,  note: 'flip' },
  ASL_WATER:    { thumb: false, index: true,  middle: true,  ring: true,  pinky: false, note: 'chin' },
  ASL_EAT:      { thumb: false, index: false, middle: false, ring: false, pinky: false, note: 'mouth' },
  ASL_PAIN:     { thumb: false, index: true,  middle: false, ring: false, pinky: false, note: 'both' },
  ASL_BATHROOM: { thumb: 'side', index: false, middle: false, ring: false, pinky: false, note: 'shake' },
}
