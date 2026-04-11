import { useRef } from 'react'
import { CameraView } from './components/CameraView'
import { useGestureRecognizer } from './hooks/useGestureRecognizer'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { landmarks, gestureName } = useGestureRecognizer(videoRef)

  function handleReady(video: HTMLVideoElement, _canvas: HTMLCanvasElement) {
    ;(videoRef as React.MutableRefObject<HTMLVideoElement>).current = video
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#0f172a' }}
    >
      <CameraView
        landmarks={landmarks}
        gestureName={gestureName}
        onReady={handleReady}
      />
    </div>
  )
}

export default App
