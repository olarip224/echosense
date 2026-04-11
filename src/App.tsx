import { useRef, useState, useEffect } from 'react'
import { useGestureRecognizer } from './hooks/useGestureRecognizer'
import { useTranscript } from './hooks/useTranscript'
import { useTTS } from './hooks/useTTS'
import { getDisplayText } from './utils/gestureMap'
import { CameraView } from './components/CameraView'
import { OutputPanel } from './components/OutputPanel'
import { GestureFlash } from './components/GestureFlash'
import { PracticeMode } from './components/PracticeMode'

const ELEVENLABS_KEY = import.meta.env.VITE_ELEVENLABS_KEY ?? ''

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { landmarks, gestureName, gestureScore, isLoaded } = useGestureRecognizer(videoRef)
  const { transcript, addPhrase, clearTranscript } = useTranscript()
  const { speak, isSpeaking } = useTTS(ELEVENLABS_KEY)

  const [copied, setCopied] = useState(false)
  const [flashText, setFlashText] = useState<string | null>(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [sensitivity, setSensitivity] = useState<'fast' | 'medium' | 'slow'>('medium')
  const [elapsed, setElapsed] = useState(0)
  const [signCount, setSignCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  function formatTime(s: number): string {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}m ${sec.toString().padStart(2, '0')}s`
  }

  const HOLD_THRESHOLD = sensitivity === 'fast' ? 10 : sensitivity === 'slow' ? 30 : 20

  const displayText = getDisplayText(gestureName)

  const holdCountRef = useRef(0)
  const lastCommittedRef = useRef('')
  const prevGestureRef = useRef<string | null>(null)

  // Reset hold count when sensitivity changes to avoid stale carry-over
  useEffect(() => {
    holdCountRef.current = 0
  }, [sensitivity])

  // Gesture commit with debounce — hold for HOLD_THRESHOLD frames before adding to transcript
  useEffect(() => {
    if (gestureName === prevGestureRef.current && gestureName !== null && gestureName !== 'None') {
      holdCountRef.current += 1
    } else {
      holdCountRef.current = 0
    }
    prevGestureRef.current = gestureName

    if (
      holdCountRef.current >= HOLD_THRESHOLD &&
      displayText !== '' &&
      displayText !== lastCommittedRef.current
    ) {
      addPhrase(displayText)
      speak(displayText)
      setFlashText(displayText)
      setSignCount((c) => c + 1)
      lastCommittedRef.current = displayText
      holdCountRef.current = 0
    }
  }, [gestureName])

  function onCopy() {
    navigator.clipboard.writeText(transcript.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function onReady(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    ;(videoRef as React.MutableRefObject<HTMLVideoElement>).current = video
    ;(canvasRef as React.MutableRefObject<HTMLCanvasElement>).current = canvas
  }

  useEffect(() => {
    if (flashText === null) return
    const id = setTimeout(() => setFlashText(null), 1500)
    return () => clearTimeout(id)
  }, [flashText])

  function resetSession() {
    setElapsed(0)
    setSignCount(0)
  }

  return (
    <div
      style={{
        background: '#0f172a',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GestureFlash text={flashText} />
      {practiceMode && (
        <PracticeMode
          currentGesture={gestureName}
          gestureScore={gestureScore}
          onExit={() => setPracticeMode(false)}
        />
      )}
      {/* Header */}
      <header
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 500 }}>EchoSense</span>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#1D9E75',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '11px', color: '#1D9E75' }}>Live</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {landmarks !== null && (
            <span style={{ fontSize: '12px', color: '#1D9E75' }}>Hand detected</span>
          )}
          <span className="session-stats" style={{ fontSize: '12px', color: '#64748b' }}>
            {signCount} signs · {formatTime(elapsed)}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {isLoaded ? 'Model ready' : 'Loading model...'}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em' }}>
              Speed
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['fast', 'medium', 'slow'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSensitivity(s)}
                  style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    border: sensitivity === s ? 'none' : '1px solid #334155',
                    background: sensitivity === s ? '#1D9E75' : 'transparent',
                    color: sensitivity === s ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setPracticeMode(true)}
            style={{
              fontSize: '12px',
              padding: '5px 12px',
              borderRadius: '6px',
              border: '1px solid #1D9E75',
              background: 'transparent',
              color: '#1D9E75',
              cursor: 'pointer',
            }}
          >
            Practice
          </button>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
        }}
      >
        <div className="main-grid">
          {/* Left — Camera */}
          <CameraView
            landmarks={landmarks}
            gestureName={gestureName}
            isLoaded={isLoaded}
            onReady={onReady}
          />

          {/* Right — Output */}
          <OutputPanel
            currentGesture={gestureName}
            displayText={displayText}
            confidence={gestureScore}
            transcript={transcript}
            isSpeaking={isSpeaking}
            copied={copied}
            onCopy={onCopy}
            onClear={() => { clearTranscript(); resetSession() }}
          />
        </div>
      </main>
    </div>
  )
}

export default App
