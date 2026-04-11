import { GESTURE_MAP } from '../utils/gestureMap'

interface Props {
  currentGesture: string | null
  displayText: string
  confidence: number
  transcript: string[]
  isSpeaking: boolean
  copied: boolean
  voices: Array<{ id: string; name: string }>
  selectedVoiceId: string
  onVoiceChange: (id: string) => void
  onCopy: () => void
  onClear: () => void
}

const GESTURE_ENTRIES = Object.entries(GESTURE_MAP).filter(([, v]) => v !== '')

export function OutputPanel({
  currentGesture,
  displayText,
  confidence,
  transcript,
  isSpeaking,
  copied,
  voices,
  selectedVoiceId,
  onVoiceChange,
  onCopy,
  onClear,
}: Props) {
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
          <div style={{ fontStyle: 'italic', fontSize: '13px', color: '#94a3b8' }}>
            Signs will appear here
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

      {/* GESTURE REFERENCE STRIP */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          marginTop: '12px',
        }}
      >
        {GESTURE_ENTRIES.map(([raw, display]) => (
          <div
            key={raw}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '5px 8px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: '12px', color: '#0f172a' }}>{display}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{raw}</div>
          </div>
        ))}
      </div>

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
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
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
