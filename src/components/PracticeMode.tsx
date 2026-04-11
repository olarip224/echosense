import { useEffect, useState } from 'react'
import { GESTURE_MAP } from '../utils/gestureMap'

const GESTURES = [
  'Thumb_Up',
  'Thumb_Down',
  'Open_Palm',
  'Closed_Fist',
  'Victory',
  'ILoveYou',
  'Pointing_Up',
]

const LABELS: Record<string, string> = GESTURE_MAP

interface Props {
  currentGesture: string | null
  gestureScore: number
  onExit: () => void
}

export function PracticeMode({ currentGesture, gestureScore, onExit }: Props) {
  const [targetIndex, setTargetIndex] = useState(() => Math.floor(Math.random() * 7))
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(false)

  const currentTarget = GESTURES[targetIndex]

  useEffect(() => {
    if (currentGesture === currentTarget && gestureScore > 0.8 && !correct) {
      setCorrect(true)
      setScore((s) => s + 1)
      const id = setTimeout(() => {
        setCorrect(false)
        setTargetIndex(Math.floor(Math.random() * 7))
      }, 1000)
      return () => clearTimeout(id)
    }
  }, [currentGesture, gestureScore])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.95)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      {/* Exit button */}
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '6px',
          border: '1px solid #334155',
          background: 'transparent',
          color: '#94a3b8',
          cursor: 'pointer',
        }}
      >
        Exit Practice
      </button>

      {/* Header */}
      <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#1D9E75', letterSpacing: '0.08em' }}>
        Practice Mode
      </div>

      {/* Score */}
      <div style={{ fontSize: '14px', color: '#64748b' }}>{score} correct</div>

      {/* Target card */}
      <div
        style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px 48px',
          textAlign: 'center',
          minWidth: '260px',
        }}
      >
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Sign this:</div>
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a' }}>
          {LABELS[currentTarget]}
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>{currentTarget}</div>

        {/* Checkmark overlay */}
        {correct && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
              background: 'rgba(240,253,244,0.92)',
              fontSize: '72px',
              animation: 'scaleIn 0.2s ease-out',
            }}
          >
            ✓
          </div>
        )}
      </div>
    </div>
  )
}
