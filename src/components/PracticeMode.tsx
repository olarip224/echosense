import { useEffect, useState } from 'react'
import { GESTURE_MAP } from '../utils/gestureMap'
import { HandDiagram } from './HandDiagram'

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
const ROUND_SIZE = 5

function pickQueue(): string[] {
  const shuffled = [...GESTURES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, ROUND_SIZE)
}

interface Props {
  currentGesture: string | null
  gestureScore: number
  onExit: () => void
}

export function PracticeMode({ currentGesture, gestureScore, onExit }: Props) {
  const [queue, setQueue] = useState<string[]>(() => pickQueue())
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [roundDone, setRoundDone] = useState(false)

  const currentTarget = queue[questionIndex]
  const progress = questionIndex + 1

  useEffect(() => {
    if (feedback !== null) return
    if (!currentTarget) return

    // Correct answer
    if (currentGesture === currentTarget && gestureScore > 0.8) {
      setFeedback('correct')
      setCorrect((c) => c + 1)
      const id = setTimeout(() => advance(), 1000)
      return () => clearTimeout(id)
    }

    // Wrong answer — gesture held with high confidence but it's the wrong one
    if (
      currentGesture !== null &&
      currentGesture !== 'None' &&
      currentGesture !== currentTarget &&
      gestureScore > 0.8
    ) {
      setFeedback('incorrect')
      setIncorrect((n) => n + 1)
      const id = setTimeout(() => {
        setFeedback(null)
      }, 800)
      return () => clearTimeout(id)
    }
  }, [currentGesture, gestureScore])

  function advance() {
    setFeedback(null)
    if (questionIndex + 1 >= ROUND_SIZE) {
      setRoundDone(true)
    } else {
      setQuestionIndex((i) => i + 1)
    }
  }

  function restart() {
    setQueue(pickQueue())
    setQuestionIndex(0)
    setCorrect(0)
    setIncorrect(0)
    setFeedback(null)
    setRoundDone(false)
  }

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
        gap: '20px',
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

      {roundDone ? (
        /* ── Round complete screen ── */
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px 48px',
            textAlign: 'center',
            minWidth: '280px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {incorrect === 0 ? '🏆' : correct >= 4 ? '🎉' : '💪'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
            Round complete!
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
            {correct} / {ROUND_SIZE} correct · {incorrect} incorrect
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={restart}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: '#1D9E75',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <button
              onClick={onExit}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Exit
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Progress + score row */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {queue.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background:
                      i < questionIndex
                        ? '#1D9E75'
                        : i === questionIndex
                        ? '#ffffff'
                        : '#334155',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Question {progress} of {ROUND_SIZE}
            </div>
          </div>

          {/* Correct / incorrect tally */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <span style={{ color: '#1D9E75' }}>✓ {correct}</span>
            <span style={{ color: '#ef4444' }}>✗ {incorrect}</span>
          </div>

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
            <div
              key={currentTarget}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px',
                       animation: 'handIn 0.2s ease-out' }}
            >
              <HandDiagram gestureKey={currentTarget} size="lg" />
            </div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a' }}>
              {LABELS[currentTarget]}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>{currentTarget}</div>

            {/* Correct overlay — green checkmark */}
            {feedback === 'correct' && (
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

            {/* Incorrect overlay — red X */}
            {feedback === 'incorrect' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '16px',
                  background: 'rgba(254,242,242,0.92)',
                  fontSize: '72px',
                  animation: 'scaleIn 0.2s ease-out',
                }}
              >
                ✗
              </div>
            )}
          </div>

          {/* Hint: what gesture is being detected */}
          {currentGesture && currentGesture !== 'None' && feedback === null && (
            <div style={{ fontSize: '12px', color: '#475569' }}>
              Detecting: <span style={{ color: '#94a3b8' }}>{LABELS[currentGesture] || currentGesture}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
