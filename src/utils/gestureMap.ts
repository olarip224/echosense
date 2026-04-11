export const GESTURE_MAP: Record<string, string> = {
  Thumb_Up: 'Yes',
  Thumb_Down: 'No',
  Open_Palm: 'Stop',
  Closed_Fist: 'Wait',
  Victory: 'Hello',
  ILoveYou: 'I love you',
  Pointing_Up: 'One moment',
  None: '',
}

export function getDisplayText(gestureName: string | null): string {
  if (gestureName === null) return ''
  return GESTURE_MAP[gestureName] ?? ''
}
