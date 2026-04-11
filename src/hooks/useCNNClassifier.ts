import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  CNN_MODEL_PATH,
  CNN_LABELS,
  CNN_CONFIDENCE_THRESHOLD,
} from '../utils/modelConfig'

export type CNNPrediction = {
  label: string
  confidence: number
  gestureKey: string // e.g. "ASL_A"
}

export function useCNNClassifier() {
  const modelRef = useRef<tf.LayersModel | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState(false)

  // Load model on mount — but only if the model file exists.
  // If it 404s, set isAvailable = false and continue silently.
  // The app uses the geometric classifier as fallback.
  useEffect(() => {
    async function loadModel() {
      try {
        // Check if model file exists before trying to load it
        const res = await fetch(CNN_MODEL_PATH, { method: 'HEAD' })
        if (!res.ok) {
          // Model not trained yet — use geometric classifier fallback
          setIsAvailable(false)
          return
        }

        const model = await tf.loadLayersModel(CNN_MODEL_PATH)

        // Warm up with a dummy input to avoid first-inference latency
        const dummyInput = tf.zeros([1, 224, 224, 3])
        const warmup = model.predict(dummyInput) as tf.Tensor
        warmup.dispose()
        dummyInput.dispose()

        modelRef.current = model
        setIsLoaded(true)
        setIsAvailable(true)
      } catch (err) {
        setLoadError('CNN model failed to load: ' + (err as Error).message)
        setIsAvailable(false)
      }
    }
    loadModel()

    return () => {
      modelRef.current?.dispose()
    }
  }, [])

  // classify() takes the live video element, captures the current frame,
  // preprocesses it, runs inference, and returns the top prediction.
  const classify = useCallback(
    async (videoElement: HTMLVideoElement): Promise<CNNPrediction | null> => {
      if (!modelRef.current || !isLoaded) return null

      return tf.tidy(() => {
        // Capture frame from video element
        const tensor = tf.browser.fromPixels(videoElement)

        // Resize to model input size (224×224)
        const resized = tf.image.resizeBilinear(tensor, [224, 224])

        // Normalize pixel values from [0,255] to [0,1]
        const normalized = resized.div(255.0)

        // Add batch dimension: [1, 224, 224, 3]
        const batched = normalized.expandDims(0)

        // Run inference
        const predictions = modelRef.current!.predict(batched) as tf.Tensor

        // Get probabilities as a plain array
        const probabilities = Array.from(predictions.dataSync())

        // Find the top prediction
        const maxIndex = probabilities.indexOf(Math.max(...probabilities))
        const confidence = probabilities[maxIndex]

        if (confidence < CNN_CONFIDENCE_THRESHOLD) return null

        const rawLabel = CNN_LABELS[maxIndex]

        // Skip non-sign classes
        if (rawLabel === 'NOTHING' || rawLabel === 'DELETE') return null

        return {
          label: rawLabel,
          confidence,
          // Map to gestureKey format used in GESTURE_MAP
          gestureKey: rawLabel === 'SPACE' ? 'ASL_SPACE' : `ASL_${rawLabel}`,
        }
      })
    },
    [isLoaded]
  )

  return { classify, isLoaded, isAvailable, loadError }
}
