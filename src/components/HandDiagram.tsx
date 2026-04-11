import { HAND_STATES, type FingerState } from '../utils/handStates'

interface Props {
  gestureKey: string
  size?: number
  active?: boolean
}

// Color palette
const EXTENDED = '#1D9E75'
const CURLED = '#cbd5e1'
const PALM_COLOR = '#f1f5f9'
const PALM_STROKE = '#e2e8f0'
const ACTIVE_GLOW = 'rgba(29,158,117,0.15)'

// Finger column x positions (palm is 80px wide, centered at 52)
const FINGERS = [
  { name: 'pinky',  x: 18 },
  { name: 'ring',   x: 34 },
  { name: 'middle', x: 50 },
  { name: 'index',  x: 66 },
] as const

function fingerColor(state: FingerState): string {
  if (state === true) return EXTENDED
  if (state === 'cross') return EXTENDED
  if (state === 'side') return '#94a3b8'
  return CURLED
}

function thumbColor(state: FingerState): string {
  if (state === true) return EXTENDED
  if (state === 'side') return EXTENDED
  return CURLED
}

/** Draw a single finger: extended = tall rect, curled = short rounded bump */
function Finger({
  x, extended, crossed
}: { x: number; extended: boolean; crossed?: boolean }) {
  if (extended) {
    return (
      <g>
        <rect
          x={x - 5}
          y={crossed ? 24 : 20}
          width={10}
          height={crossed ? 28 : 32}
          rx={5}
          fill={EXTENDED}
          transform={crossed ? `rotate(12, ${x}, 38)` : undefined}
        />
        {/* fingernail hint */}
        <rect x={x - 3} y={crossed ? 26 : 22} width={6} height={6} rx={3} fill="rgba(255,255,255,0.35)" />
      </g>
    )
  }
  // Curled — small rounded knuckle bump at top of palm
  return (
    <ellipse cx={x} cy={52} rx={5} ry={4} fill={CURLED} />
  )
}

/** Sideways-pointing finger (for G, H, horizontal gestures) */
function SidewaysFinger({ y, color }: { y: number; color: string }) {
  return (
    <g>
      <rect x={82} y={y - 4} width={24} height={8} rx={4} fill={color} />
      <rect x={84} y={y - 2} width={6} height={4} rx={2} fill="rgba(255,255,255,0.35)" />
    </g>
  )
}

/** Special overlays for notes */
function NoteOverlay({ note, active }: { note: string; active: boolean }) {
  const color = active ? '#1D9E75' : '#94a3b8'
  const labels: Record<string, string> = {
    curve: 'curve',
    claw:  'claw',
    D:     'circle',
    F:     'OK',
    K:     'thumb\nbetween',
    M:     '3 over\nthumb',
    N:     '2 over\nthumb',
    O:     'circle',
    S:     'fist',
    '6':   'pinky\n+thumb',
    '7':   'ring\n+thumb',
    '8':   'mid\n+thumb',
    '9':   'idx\n+thumb',
    chest: 'chest',
    chin:  'chin',
    lift:  'lift',
    both:  'both\nhands',
    flip:  'flip out',
    mouth: 'mouth',
    shake: 'shake',
  }
  const text = labels[note] ?? note
  const lines = text.split('\n')
  return (
    <g>
      {lines.map((line, i) => (
        <text
          key={i}
          x={52}
          y={108 + i * 10}
          textAnchor="middle"
          fontSize={8}
          fill={color}
          fontFamily="sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  )
}

export function HandDiagram({ gestureKey, size = 104, active = false }: Props) {
  const state = HAND_STATES[gestureKey]

  if (!state) {
    // Fallback: plain gray palm
    return (
      <svg width={size} height={size} viewBox="0 0 104 120">
        <rect x={20} y={50} width={64} height={50} rx={10} fill={PALM_COLOR} stroke={PALM_STROKE} strokeWidth={1} />
        <text x={52} y={80} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="sans-serif">no data</text>
      </svg>
    )
  }

  const { thumb, index, middle, ring, pinky, note } = state

  const palmFill = active ? ACTIVE_GLOW : PALM_COLOR

  // Determine which fingers are sideways
  const indexSide  = index  === 'side'
  const middleSide = middle === 'side'
  const ringSide   = ring   === 'side'
  const pinkySide  = pinky  === 'side'

  // For normal (non-sideways) fingers
  const showNormal = [
    { name: 'pinky',  x: FINGERS[0].x, state: pinky  },
    { name: 'ring',   x: FINGERS[1].x, state: ring   },
    { name: 'middle', x: FINGERS[2].x, state: middle },
    { name: 'index',  x: FINGERS[3].x, state: index  },
  ]

  // Thumb: extended = up-left diagonal; side = right; curled = tucked inside palm
  function ThumbShape() {
    if (thumb === true) {
      return (
        <g>
          <rect x={4} y={42} width={10} height={24} rx={5} fill={EXTENDED} transform="rotate(-20, 9, 54)" />
          <rect x={5} y={44} width={6} height={6} rx={3} fill="rgba(255,255,255,0.35)" transform="rotate(-20, 9, 54)" />
        </g>
      )
    }
    if (thumb === 'side') {
      return (
        <g>
          {/* thumb pointing sideways (Thumb_Down uses rotate on SVG level or here) */}
          <rect x={2} y={54} width={22} height={10} rx={5} fill={EXTENDED} transform="rotate(-15, 12, 59)" />
          <rect x={4} y={56} width={6} height={6} rx={3} fill="rgba(255,255,255,0.35)" transform="rotate(-15, 12, 59)" />
        </g>
      )
    }
    // curled — small nub inside palm area
    return <ellipse cx={16} cy={68} rx={5} ry={4} fill={CURLED} />
  }

  // Special-case: Thumb_Down — flip the whole SVG vertically
  const isThumbDown = gestureKey === 'Thumb_Down'

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 104 120"
      style={{ display: 'block' }}
    >
      {/* Palm */}
      <rect
        x={12}
        y={50}
        width={72}
        height={52}
        rx={12}
        fill={palmFill}
        stroke={active ? '#1D9E75' : PALM_STROKE}
        strokeWidth={active ? 1.5 : 1}
      />

      {/* Wrist */}
      <rect x={24} y={95} width={48} height={16} rx={6}
        fill={palmFill}
        stroke={active ? '#1D9E75' : PALM_STROKE}
        strokeWidth={active ? 1.5 : 1}
      />

      {/* Normal fingers (non-sideways) */}
      {showNormal.map(({ x, state: s }) => {
        if (s === 'side') return null
        return (
          <Finger
            key={x}
            x={x}
            extended={s === true}
            crossed={s === 'cross'}
          />
        )
      })}

      {/* Sideways fingers stacked on right */}
      {indexSide  && <SidewaysFinger y={56} color={fingerColor(index)} />}
      {middleSide && <SidewaysFinger y={66} color={fingerColor(middle)} />}
      {ringSide   && <SidewaysFinger y={76} color={fingerColor(ring)} />}
      {pinkySide  && <SidewaysFinger y={86} color={fingerColor(pinky)} />}

      {/* Thumb */}
      <ThumbShape />

      {/* Note overlay */}
      {note && <NoteOverlay note={note} active={active} />}
    </svg>
  )

  if (isThumbDown) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 104 120"
        style={{ display: 'block' }}
      >
        <g transform="translate(104, 120) rotate(180)">
          {/* re-render content with flip */}
          <rect x={12} y={50} width={72} height={52} rx={12}
            fill={palmFill} stroke={active ? '#1D9E75' : PALM_STROKE} strokeWidth={active ? 1.5 : 1} />
          <rect x={24} y={95} width={48} height={16} rx={6}
            fill={palmFill} stroke={active ? '#1D9E75' : PALM_STROKE} strokeWidth={active ? 1.5 : 1} />
          {showNormal.map(({ x }) => (
            <Finger key={x} x={x} extended={false} />
          ))}
          {/* Thumb pointing "down" after flip = was pointing up */}
          <rect x={4} y={42} width={10} height={24} rx={5} fill={EXTENDED} transform="rotate(-20, 9, 54)" />
          <rect x={5} y={44} width={6} height={6} rx={3} fill="rgba(255,255,255,0.35)" transform="rotate(-20, 9, 54)" />
        </g>
      </svg>
    )
  }

  return svgContent
}
