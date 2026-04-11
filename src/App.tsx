import { useRef, useState, useEffect } from 'react'
import { useGestureRecognizer } from './hooks/useGestureRecognizer'
import { useTranscript } from './hooks/useTranscript'
import { useTTS } from './hooks/useTTS'
import { getDisplayText, GESTURE_MAP } from './utils/gestureMap'
import { CameraView } from './components/CameraView'
import { OutputPanel } from './components/OutputPanel'
import { GestureFlash } from './components/GestureFlash'
import { PracticeMode } from './components/PracticeMode'

const ELEVENLABS_KEY = import.meta.env.VITE_ELEVENLABS_KEY ?? ''

const VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh' },
]

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { landmarks, gestureName, gestureScore, isLoaded } = useGestureRecognizer(videoRef)
  const { transcript, addPhrase, clearTranscript } = useTranscript()
  const { speak, isSpeaking } = useTTS(ELEVENLABS_KEY)

  const [copied, setCopied] = useState(false)
  const [flashText, setFlashText] = useState<string | null>(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [signCount, setSignCount] = useState(0)
  const [sensitivity, setSensitivity] = useState<'fast' | 'medium' | 'slow'>('medium')
  const [selectedVoiceId, setSelectedVoiceId] = useState(VOICES[0].id)
  const [mode, setMode] = useState<'phrase' | 'spell'>('phrase')
  const [currentWord, setCurrentWord] = useState('')
  const [showAbout, setShowAbout] = useState(false)

  // Refs for spell mode (avoid stale closures in useEffect)
  const modeRef = useRef<'phrase' | 'spell'>('phrase')
  const currentWordRef = useRef('')

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

  // Reset hold count when sensitivity changes
  useEffect(() => {
    holdCountRef.current = 0
  }, [sensitivity])

  // Gesture commit logic
  useEffect(() => {
    if (gestureName === prevGestureRef.current && gestureName !== null && gestureName !== 'None') {
      holdCountRef.current += 1
    } else {
      holdCountRef.current = 0
    }
    prevGestureRef.current = gestureName

    if (
      holdCountRef.current >= HOLD_THRESHOLD &&
      gestureName !== null &&
      gestureName !== 'None' &&
      displayText !== lastCommittedRef.current
    ) {
      if (modeRef.current === 'spell') {
        // Letter: append to word
        if (/^ASL_[A-Z]$/.test(gestureName)) {
          const letter = GESTURE_MAP[gestureName] ?? ''
          const newWord = currentWordRef.current + letter
          currentWordRef.current = newWord
          setCurrentWord(newWord)
          lastCommittedRef.current = '' // allow same letter again
          holdCountRef.current = 0
        } else if (gestureName === 'Open_Palm') {
          // Commit word to transcript
          if (currentWordRef.current !== '') {
            addPhrase(currentWordRef.current)
            speak(currentWordRef.current, selectedVoiceId)
            setFlashText(currentWordRef.current)
            setSignCount((c) => c + 1)
            currentWordRef.current = ''
            setCurrentWord('')
          }
          lastCommittedRef.current = displayText
          holdCountRef.current = 0
        } else if (gestureName === 'Closed_Fist') {
          // Backspace
          const newWord = currentWordRef.current.slice(0, -1)
          currentWordRef.current = newWord
          setCurrentWord(newWord)
          lastCommittedRef.current = ''
          holdCountRef.current = 0
        } else if (displayText !== '') {
          // Other non-letter gestures in spell mode act as phrase
          addPhrase(displayText)
          speak(displayText, selectedVoiceId)
          setFlashText(displayText)
          setSignCount((c) => c + 1)
          lastCommittedRef.current = displayText
          holdCountRef.current = 0
        }
      } else {
        // Phrase mode
        if (displayText !== '') {
          addPhrase(displayText)
          speak(displayText, selectedVoiceId)
          setFlashText(displayText)
          setSignCount((c) => c + 1)
          lastCommittedRef.current = displayText
          holdCountRef.current = 0
        }
      }
    }
  }, [gestureName])

  useEffect(() => {
    if (flashText === null) return
    const id = setTimeout(() => setFlashText(null), 1500)
    return () => clearTimeout(id)
  }, [flashText])

  function changeMode(m: 'phrase' | 'spell') {
    modeRef.current = m
    setMode(m)
    holdCountRef.current = 0
    currentWordRef.current = ''
    setCurrentWord('')
    lastCommittedRef.current = ''
  }

  function resetSession() {
    setElapsed(0)
    setSignCount(0)
  }

  function onCopy() {
    navigator.clipboard.writeText(transcript.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function onReady(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    ;(videoRef as React.MutableRefObject<HTMLVideoElement>).current = video
    ;(canvasRef as React.MutableRefObject<HTMLCanvasElement>).current = canvas
  }

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GestureFlash text={flashText} />

      {practiceMode && (
        <PracticeMode
          currentGesture={gestureName}
          gestureScore={gestureScore}
          onExit={() => setPracticeMode(false)}
        />
      )}

      {/* About modal */}
      {showAbout && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowAbout(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '440px',
              width: '90%',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>EchoSense</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
              Real-time American Sign Language interpreter
            </div>
            <div style={{ marginTop: '20px', fontSize: '13px', color: '#334155', lineHeight: 1.7 }}>
              <p>Supports 7 quick response gestures, full ASL alphabet A–Z, and numbers 0–9.</p>
              <p style={{ marginTop: '8px' }}>Built with React, MediaPipe, and ElevenLabs at BitCamp 2026.</p>
              <p style={{ marginTop: '8px', color: '#1D9E75', fontStyle: 'italic' }}>
                500,000+ ASL users in the US deserve spontaneous communication.
              </p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              style={{
                marginTop: '24px',
                padding: '8px 20px',
                borderRadius: '8px',
                background: '#1D9E75',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {/* Left: logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 500 }}>EchoSense</span>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75' }} />
          <span style={{ fontSize: '11px', color: '#1D9E75' }}>Live</span>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {landmarks !== null && (
            <span style={{ fontSize: '12px', color: '#1D9E75' }}>Hand detected</span>
          )}

          <span className="session-stats" style={{ fontSize: '12px', color: '#64748b' }}>
            {signCount} signs · {formatTime(elapsed)}
          </span>

          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {isLoaded ? 'Model ready' : 'Loading model...'}
          </span>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['phrase', 'spell'] as const).map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  border: mode === m ? 'none' : '1px solid #334155',
                  background: mode === m ? '#1D9E75' : 'transparent',
                  color: mode === m ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {/* Speed control */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
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
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Practice + About buttons */}
          <button
            onClick={() => setPracticeMode(true)}
            style={{
              fontSize: '12px', padding: '5px 12px', borderRadius: '6px',
              border: '1px solid #1D9E75', background: 'transparent', color: '#1D9E75', cursor: 'pointer',
            }}
          >
            Practice
          </button>
          <button
            onClick={() => setShowAbout(true)}
            style={{
              fontSize: '12px', padding: '5px 10px', borderRadius: '6px',
              border: '1px solid #334155', background: 'transparent', color: '#64748b', cursor: 'pointer',
            }}
          >
            ?
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div className="main-grid">
          <CameraView
            landmarks={landmarks}
            gestureName={gestureName}
            isLoaded={isLoaded}
            onReady={onReady}
          />
          <OutputPanel
            currentGesture={gestureName}
            displayText={displayText}
            confidence={gestureScore}
            transcript={transcript}
            isSpeaking={isSpeaking}
            copied={copied}
            mode={mode}
            currentWord={currentWord}
            voices={VOICES}
            selectedVoiceId={selectedVoiceId}
            onVoiceChange={setSelectedVoiceId}
            onCopy={onCopy}
            onClear={() => { clearTranscript(); resetSession() }}
          />
        </div>
      </main>
    </div>
  )
}

export default App
