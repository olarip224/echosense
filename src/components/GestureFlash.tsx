import { HandDiagram } from './HandDiagram'

interface Props {
  text: string | null
  gestureKey: string | null
}

export function GestureFlash({ text, gestureKey }: Props) {
  if (text === null) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: '#0F6E56',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        animation: 'slideDown 0.2s ease-out',
      }}
    >
      {gestureKey && (
        <HandDiagram gestureKey={gestureKey} size="sm" />
      )}
      <span style={{ fontSize: '28px', fontWeight: 600, color: '#ffffff' }}>
        {text}
      </span>
    </div>
  )
}
