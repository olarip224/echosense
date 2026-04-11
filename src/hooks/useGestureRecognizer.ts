import { useEffect, useRef, useState } from 'react'
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision'

interface GestureResult {
  landmarks: Array<{ x: number; y: number; z: number }> | null
  gestureName: string | null
  gestureScore: number
  isLoaded: boolean
}

export function useGestureRecognizer(
  videoRef: React.RefObject<HTMLVideoElement>
): GestureResult {
  const recognizerRef = useRef<GestureRecognizer | null>(null)
  const rafRef = useRef<number>(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [landmarks, setLandmarks] = useState<Array<{ x: number; y: number; z: number }> | null>(null)
  const [gestureName, setGestureName] = useState<string | null>(null)
  const [gestureScore, setGestureScore] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      )
      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      })
      if (!cancelled) {
        recognizerRef.current = recognizer
        setIsLoaded(true)
      }
    }

    load().catch(console.error)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      recognizerRef.current?.close()
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    function loop() {
      const video = videoRef.current
      const recognizer = recognizerRef.current
      if (video && recognizer && video.readyState >= 2) {
        const results = recognizer.recognizeForVideo(video, Date.now())
        setLandmarks(results.landmarks[0] ?? null)
        setGestureName(results.gestures[0]?.[0]?.categoryName ?? null)
        setGestureScore(results.gestures[0]?.[0]?.score ?? 0)
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isLoaded, videoRef])

  return { landmarks, gestureName, gestureScore, isLoaded }
}
