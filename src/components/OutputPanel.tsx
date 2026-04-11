import { useState } from 'react'
import { VOCABULARY_SECTIONS } from '../utils/gestureMap'

interface Props {
  currentGesture: string | null
  displayText: string
  confidence: number
  transcript: string[]
  isSpeaking: boolean
  copied: boolean
  mode: 'phrase' | 'spell'
  currentWord: string
  voices: Array<{ id: string; name: string }>
  selectedVoiceId: string
  onVoiceChange: (id: string) => void
  onCopy: () => void
  onClear: () => void
}

export function OutputPanel({
  currentGesture,
  displayText,
  confidence,
  transcript,
  isSpeaking,
  copied,
  mode,
  currentWord,
  voices,
  selectedVoiceId,
  onVoiceChange,
  onCopy,
  onClear,
}: Props) {
  const [refOpen, setRefOpen] = useState(false)

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        minHeight: '320px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* TOP */}
      <div>
        <div
          style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            color: '#64748b',
            letterSpacing: '0.06em',
          }}
        >
          Now detecting
        </div>
        <div
          key={displayText}
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#0f172a',
            minHeight: '44px',
            marginTop: '4px',
            animation: 'fadeUp 0.2s ease-out',
          }}
        >
          {displayText}
        </div>
        {/* Confidence bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: '#e2e8f0',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              width: `${confidence * 100}%`,
              height: '100%',
              borderRadius: '3px',
              background: '#1D9E75',
              transition: 'width 200ms ease',
            }}
          />
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
          {currentGesture ?? ''}
        </div>

        {/* Word builder (spell mode) */}
        {mode === 'spell' && currentWord !== '' && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Building:
            </div>
            <span
              className="word-cursor"
              style={{ fontSize: '16px', fontFamily: 'monospace', color: '#0f172a', marginTop: '2px', display: 'inline-block' }}
            >
              {currentWord}
            </span>
          </div>
        )}
        {mode === 'spell' && currentWord === '' && (
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
            Spell mode: sign letters → Open Palm to commit word
          </div>
        )}
      </div>

      {/* MIDDLE */}
      <div style={{ flex: 1, overflowY: 'auto', marginTop: '16px' }}>
        <div
          style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            color: '#64748b',
            letterSpacing: '0.06em',
            marginBottom: '8px',
          }}
        >
          Transcript
        </div>
        {transcript.length === 0 ? (
          <div style={{ fontStyle: 'italic', fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
            Try signing: thumbs up = Yes · peace sign = Hello · or switch to Spell mode to build words letter by letter
          </div>
        ) : (
          <div>
            {transcript.map((item, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  background: '#f0fdf4',
                  color: '#166534',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  margin: '3px',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* REFERENCE PANEL (when open) */}
      {refOpen && (
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            borderTop: '1px solid #f1f5f9',
            padding: '12px',
            background: '#fafafa',
            marginTop: '8px',
          }}
        >
          {VOCABULARY_SECTIONS.map((sec) => (
            <div key={sec.section} style={{ marginBottom: '10px' }}>
              <div
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  letterSpacing: '0.06em',
                  marginBottom: '4px',
                }}
              >
                {sec.section}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {sec.entries.map((entry) => {
                  const active = entry.key === currentGesture
                  return (
                    <span
                      key={entry.key}
                      style={{
                        borderRadius: '20px',
                        padding: '3px 9px',
                        fontSize: '11px',
                        margin: '2px',
                        background: active ? '#1D9E75' : '#f1f5f9',
                        color: active ? '#ffffff' : '#334155',
                        border: active ? 'none' : '1px solid #e2e8f0',
                        transition: 'background 150ms ease',
                      }}
                    >
                      {entry.label}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: voice + speaking */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Voice:</span>
          <select
            value={selectedVoiceId}
            onChange={(e) => onVoiceChange(e.target.value)}
            style={{
              fontSize: '11px',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '2px 6px',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {voices.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          {isSpeaking && (
            <>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#1D9E75',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '11px', color: '#1D9E75' }}>Speaking...</span>
            </>
          )}
        </div>

        {/* Right: Reference + Copy + Download + Clear */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { label: refOpen ? 'Reference ▴' : 'Reference ▾', action: () => setRefOpen((o) => !o) },
            { label: copied ? 'Copied!' : 'Copy', action: onCopy },
            {
              label: 'Download',
              action: () => {
                const content =
                  'EchoSense Transcript\n' +
                  'Generated: ' + new Date().toLocaleString() + '\n' +
                  '---\n' +
                  transcript.join('\n')
                const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
                const a = document.createElement('a')
                a.href = url
                a.download = 'echosense-transcript-' + Date.now() + '.txt'
                a.click()
                URL.revokeObjectURL(url)
              },
            },
            { label: 'Clear', action: onClear },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
