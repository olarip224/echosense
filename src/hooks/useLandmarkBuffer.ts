import { useRef, useCallback } from 'react'
import type { Landmark } from '../utils/aslClassifier'
import { LSTM_SEQUENCE_LENGTH } from '../utils/modelConfig'

export function useLandmarkBuffer() {
  const buffer = useRef<Landmark[][]>([])

  const addFrame = useCallback((landmarks: Landmark[] | null) => {
    if (!landmarks) {
      // No hand detected — clear buffer so LSTM doesn't classify across a gap
      buffer.current = []
      return
    }
    buffer.current.push(landmarks)
    // Keep only the last LSTM_SEQUENCE_LENGTH frames
    if (buffer.current.length > LSTM_SEQUENCE_LENGTH) {
      buffer.current = buffer.current.slice(-LSTM_SEQUENCE_LENGTH)
    }
  }, [])

  const getBuffer = useCallback((): Landmark[][] => buffer.current, [])

  const isReady = useCallback(
    (): boolean => buffer.current.length === LSTM_SEQUENCE_LENGTH,
    []
  )

  const clearBuffer = useCallback(() => {
    buffer.current = []
  }, [])

  return { addFrame, getBuffer, isReady, clearBuffer }
}
