// ─────────────────────────────────────────────────────────────────────────────
// EchoSense — 3D-style SVG hand diagram component system
// Each gesture is a self-contained SVG. No external images.
// ─────────────────────────────────────────────────────────────────────────────

import type { JSX } from 'react'

// ── Design tokens ─────────────────────────────────────────────────────────────
const SKIN_BASE   = '#F0A876'
const SKIN_MID    = '#E8956D'
const SKIN_DARK   = '#D4784E'
const SKIN_LIGHT  = '#FAC49A'
const SKIN_SHADOW = 'rgba(180,90,40,0.18)'
const NAIL        = '#F5D5C0'
const NAIL_STROKE = '#E0B898'

// ── Shared sub-shapes ─────────────────────────────────────────────────────────

/** Standard palm */
function Palm({ id, x = 34, y = 90, w = 92, h = 64, rx = 18 }: {
  id: string; x?: number; y?: number; w?: number; h?: number; rx?: number
}) {
  return (
    <>
      <defs>
        <radialGradient id={`pg_${id}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={SKIN_LIGHT} />
          <stop offset="100%" stopColor={SKIN_MID} />
        </radialGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#pg_${id})`} />
    </>
  )
}

/** Standard wrist */
function Wrist({ x = 48, y = 146, w = 64, h = 28 }: {
  x?: number; y?: number; w?: number; h?: number
}) {
  return <rect x={x} y={y} width={w} height={h} rx={12} fill={SKIN_MID} />
}

/** Extended finger with shadow + nail */
function ExtFinger({ x, y, w, h, rx, nail }: {
  x: number; y: number; w: number; h: number; rx: number
  nail?: { x: number; y: number; w: number; h: number }
}) {
  const nx = nail?.x ?? x + 2
  const ny = nail?.y ?? y + 3
  const nw = nail?.w ?? w - 4
  const nh = nail?.h ?? 14
  return (
    <g>
      <rect x={x + 2} y={y + 3} width={w} height={h} rx={rx} fill={SKIN_SHADOW} />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={SKIN_BASE} />
      <rect x={nx} y={ny} width={nw} height={nh} rx={5}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
    </g>
  )
}

/** Curled finger knuckle bump */
function CurlBump({ x, y, w, h, rx }: {
  x: number; y: number; w: number; h: number; rx: number
}) {
  return (
    <g>
      <rect x={x + 1} y={y + 2} width={w} height={h} rx={rx} fill={SKIN_SHADOW} />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={SKIN_MID} />
    </g>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GESTURE HAND SHAPES
// ─────────────────────────────────────────────────────────────────────────────

/** Index up — 1, Pointing_Up, D, one moment */
function Hand_PointingUp(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="PointingUp" x={40} y={85} w={80} h={65} rx={18} />
      <Wrist x={52} y={143} w={56} h={30} />
      {/* Index — extended */}
      <ExtFinger x={84} y={18} w={20} h={72} rx={10} nail={{ x: 87, y: 21, w: 14, h: 16 }} />
      {/* Middle curled */}
      <CurlBump x={62} y={75} w={18} h={22} rx={9} />
      {/* Ring curled */}
      <CurlBump x={43} y={79} w={17} h={19} rx={8} />
      {/* Pinky curled */}
      <CurlBump x={26} y={84} w={15} h={16} rx={7} />
      {/* Thumb tucked */}
      <g transform="rotate(-30, 45, 120)">
        <rect x={22} y={108} width={16} height={36} rx={8} fill={SKIN_MID} />
      </g>
    </svg>
  )
}

/** Thumbs up — Yes, Thumb_Up, Help */
function Hand_ThumbsUp(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="ThumbsUp" x={42} y={88} w={76} h={62} rx={16} />
      <Wrist x={54} y={142} w={52} h={28} />
      {/* Thumb extended upward */}
      <ellipse cx={38} cy={45} rx={10} ry={38} fill={SKIN_SHADOW} transform="translate(2,3)" />
      <rect x={29} y={15} width={20} height={76} rx={10} fill={SKIN_BASE} />
      <rect x={32} y={18} width={14} height={16} rx={5}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
      <ellipse cx={39} cy={87} rx={9} ry={5} fill={SKIN_DARK} opacity={0.3} />
      {/* Curled fingers — shown as side bumps */}
      <CurlBump x={94} y={78} w={18} h={24} rx={9} />
      <CurlBump x={94} y={68} w={18} h={22} rx={9} />
      <CurlBump x={94} y={76} w={16} h={21} rx={8} />
      <CurlBump x={94} y={84} w={14} h={18} rx={7} />
    </svg>
  )
}

/** Thumbs down — No, Thumb_Down — flipped ThumbsUp */
function Hand_ThumbsDown(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pg_ThumbsDown" cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={SKIN_LIGHT} />
          <stop offset="100%" stopColor={SKIN_MID} />
        </radialGradient>
      </defs>
      {/* Flip the whole hand upside-down */}
      <g transform="scale(1,-1) translate(0,-180)">
        <rect x={42} y={88} width={76} height={62} rx={16} fill={`url(#pg_ThumbsDown)`} />
        <rect x={54} y={142} width={52} height={28} rx={12} fill={SKIN_MID} />
        {/* Thumb */}
        <ellipse cx={38} cy={45} rx={10} ry={38} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={29} y={15} width={20} height={76} rx={10} fill={SKIN_BASE} />
        <rect x={32} y={18} width={14} height={16} rx={5}
              fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
        <ellipse cx={39} cy={87} rx={9} ry={5} fill={SKIN_DARK} opacity={0.3} />
        {/* Curled fingers */}
        <rect x={96} y={79} width={17} height={22} rx={9} fill={SKIN_SHADOW} transform="translate(1,2)" />
        <rect x={95} y={78} width={18} height={24} rx={9} fill={SKIN_MID} />
        <rect x={95} y={68} width={18} height={22} rx={9} fill={SKIN_BASE} />
        <rect x={95} y={76} width={16} height={21} rx={8} fill={SKIN_MID} />
        <rect x={95} y={84} width={14} height={18} rx={7} fill={SKIN_MID} />
      </g>
    </svg>
  )
}

/** Open palm — Stop, 5, PLEASE, THANKYOU, FINISHED */
function Hand_OpenPalm(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="OpenPalm" x={30} y={95} w={100} h={58} rx={18} />
      <Wrist x={45} y={146} w={70} h={28} />
      {/* Pinky */}
      <ExtFinger x={28} y={32} w={17} h={66} rx={8} nail={{ x: 30, y: 34, w: 13, h: 14 }} />
      {/* Ring */}
      <ExtFinger x={49} y={24} w={18} h={74} rx={9} nail={{ x: 51, y: 26, w: 14, h: 15 }} />
      {/* Middle (tallest) */}
      <ExtFinger x={71} y={16} w={20} h={82} rx={10} nail={{ x: 73, y: 18, w: 16, h: 16 }} />
      {/* Index */}
      <ExtFinger x={94} y={24} w={18} h={74} rx={9} nail={{ x: 96, y: 26, w: 14, h: 15 }} />
      {/* Thumb */}
      <g transform="rotate(-40, 35, 110)">
        <rect x={21} y={87} width={16} height={52} rx={8} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={20} y={85} width={16} height={52} rx={8} fill={SKIN_BASE} />
        <rect x={22} y={87} width={12} height={14} rx={5} fill={NAIL} />
      </g>
    </svg>
  )
}

/** Closed fist — Wait, A, S, E, SORRY */
function Hand_ClosedFist(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="Fist" x={32} y={72} w={96} h={76} rx={20} />
      <Wrist x={46} y={140} w={68} h={30} />
      {/* Knuckle row */}
      <ellipse cx={47} cy={75} rx={11} ry={8} fill={SKIN_SHADOW} transform="translate(1,2)" />
      <ellipse cx={46} cy={74} rx={12} ry={9} fill={SKIN_BASE} />
      <ellipse cx={69} cy={69} rx={12} ry={9} fill={SKIN_SHADOW} transform="translate(1,2)" />
      <ellipse cx={68} cy={68} rx={13} ry={10} fill={SKIN_BASE} />
      <ellipse cx={91} cy={67} rx={13} ry={9} fill={SKIN_SHADOW} transform="translate(1,2)" />
      <ellipse cx={90} cy={66} rx={14} ry={10} fill={SKIN_BASE} />
      <ellipse cx={112} cy={71} rx={11} ry={8} fill={SKIN_SHADOW} transform="translate(1,2)" />
      <ellipse cx={111} cy={70} rx={12} ry={9} fill={SKIN_BASE} />
      {/* Thumb across front */}
      <rect x={33} y={98} width={58} height={18} rx={9} fill={SKIN_MID} />
      <rect x={74} y={99} width={14} height={14} rx={5}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
    </svg>
  )
}

/** Peace / Victory / V — Hello, 2, K */
function Hand_Victory(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="Victory" x={34} y={90} w={92} h={62} rx={18} />
      <Wrist x={48} y={144} w={64} h={28} />
      {/* Index — angled left */}
      <g transform="rotate(-12, 88, 90)">
        <rect x={81} y={21} width={17} height={72} rx={9} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={79} y={18} width={18} height={74} rx={9} fill={SKIN_BASE} />
        <rect x={81} y={20} width={14} height={15} rx={5}
              fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
      </g>
      {/* Middle — angled right */}
      <g transform="rotate(12, 96, 90)">
        <rect x={92} y={17} width={18} height={76} rx={10} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={91} y={14} width={20} height={78} rx={10} fill={SKIN_BASE} />
        <rect x={93} y={16} width={16} height={16} rx={6}
              fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
      </g>
      {/* Curled ring */}
      <CurlBump x={56} y={76} w={17} h={22} rx={8} />
      {/* Curled pinky */}
      <CurlBump x={38} y={80} w={15} h={19} rx={7} />
      {/* Thumb tucked */}
      <g transform="rotate(-25, 42, 118)">
        <rect x={28} y={104} width={16} height={32} rx={8} fill={SKIN_MID} />
      </g>
    </svg>
  )
}

/** I Love You — ILoveYou (pinky + index + thumb extended) */
function Hand_ILoveYou(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="ILY" x={32} y={88} w={96} h={64} rx={18} />
      <Wrist x={46} y={144} w={68} h={28} />
      {/* Pinky extended */}
      <ExtFinger x={29} y={30} w={16} h={62} rx={8} nail={{ x: 31, y: 32, w: 12, h: 14 }} />
      {/* Index extended */}
      <ExtFinger x={94} y={20} w={19} h={72} rx={9} nail={{ x: 96, y: 22, w: 15, h: 15 }} />
      {/* Thumb to side */}
      <g transform="rotate(-45, 38, 108)">
        <rect x={23} y={89} width={15} height={48} rx={8} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={22} y={88} width={16} height={48} rx={8} fill={SKIN_BASE} />
        <rect x={24} y={90} width={12} height={14} rx={5} fill={NAIL} />
      </g>
      {/* Middle curled */}
      <CurlBump x={70} y={72} w={19} h={24} rx={9} />
      {/* Ring curled */}
      <CurlBump x={50} y={76} w={17} h={21} rx={8} />
    </svg>
  )
}

/** L shape — ASL_L */
function Hand_L(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="L" x={38} y={90} w={84} h={62} rx={16} />
      <Wrist x={50} y={144} w={60} h={28} />
      {/* Index extended up */}
      <ExtFinger x={93} y={16} w={20} h={78} rx={10} nail={{ x: 95, y: 18, w: 16, h: 16 }} />
      {/* Thumb horizontal out to left */}
      <g transform="rotate(-85, 52, 100)">
        <rect x={37} y={91} width={15} height={52} rx={8} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={36} y={90} width={16} height={52} rx={8} fill={SKIN_BASE} />
        <rect x={38} y={92} width={12} height={14} rx={5} fill={NAIL} />
      </g>
      {/* Middle curled */}
      <CurlBump x={70} y={76} w={18} h={22} rx={9} />
      {/* Ring curled */}
      <CurlBump x={51} y={80} w={16} h={20} rx={8} />
      {/* Pinky curled */}
      <CurlBump x={34} y={84} w={15} h={18} rx={7} />
    </svg>
  )
}

/** B / 4 — all 4 fingers extended, thumb tucked */
function Hand_B(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="B" x={34} y={96} w={92} h={58} rx={16} />
      <Wrist x={48} y={146} w={64} h={28} />
      {/* Four fingers side by side */}
      <ExtFinger x={36} y={24} w={17} h={75} rx={8} nail={{ x: 38, y: 26, w: 13, h: 14 }} />
      <ExtFinger x={56} y={18} w={18} h={81} rx={9} nail={{ x: 58, y: 20, w: 14, h: 15 }} />
      <ExtFinger x={77} y={14} w={20} h={85} rx={10} nail={{ x: 79, y: 16, w: 16, h: 16 }} />
      <ExtFinger x={99} y={18} w={18} h={81} rx={9} nail={{ x: 101, y: 20, w: 14, h: 15 }} />
      {/* Thumb tucked as dark band */}
      <rect x={34} y={108} width={46} height={16} rx={8} fill={SKIN_DARK} opacity={0.7} />
    </svg>
  )
}

/** O / 0 / C — all fingers curved to form O ring */
function Hand_O(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="O" x={44} y={96} w={72} h={58} rx={16} />
      <Wrist x={50} y={146} w={60} h={28} />
      {/* O ring shape */}
      <path d="M 52 88 C 42 68, 38 42, 55 32 C 72 22, 108 22, 118 38 C 128 54, 118 82, 108 92 C 90 104, 62 104, 52 88 Z"
            fill="none" stroke={SKIN_BASE} strokeWidth="22" strokeLinecap="round" />
      {/* O hole */}
      <ellipse cx={82} cy={62} rx={20} ry={22} fill="white" opacity={0.88} />
      {/* Nail hints across top arc */}
      <rect x={53} y={26} width={11} height={10} rx={4}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} opacity={0.85} />
      <rect x={74} y={18} width={12} height={10} rx={4}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} opacity={0.85} />
      <rect x={97} y={22} width={11} height={10} rx={4}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} opacity={0.85} />
      <rect x={112} y={38} width={10} height={10} rx={4}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} opacity={0.85} />
    </svg>
  )
}

/** 3 / W / WATER — thumb + index + middle extended */
function Hand_ThreeFingers(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="Three" x={32} y={92} w={96} h={62} rx={18} />
      <Wrist x={46} y={146} w={68} h={28} />
      {/* Thumb angled out */}
      <g transform="rotate(-40, 38, 110)">
        <rect x={23} y={91} width={15} height={50} rx={8} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={22} y={90} width={16} height={50} rx={8} fill={SKIN_BASE} />
        <rect x={24} y={92} width={12} height={14} rx={5} fill={NAIL} />
      </g>
      {/* Index */}
      <ExtFinger x={86} y={18} w={19} h={77} rx={9} nail={{ x: 88, y: 20, w: 15, h: 15 }} />
      {/* Middle */}
      <ExtFinger x={108} y={14} w={20} h={80} rx={10} nail={{ x: 110, y: 16, w: 16, h: 16 }} />
      {/* Ring curled */}
      <CurlBump x={66} y={78} w={17} h={22} rx={8} />
      {/* Pinky curled */}
      <CurlBump x={38} y={83} w={15} h={19} rx={7} />
    </svg>
  )
}

/** F / 9 — OK circle: index + thumb tips touching, others up */
function Hand_OKorF(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="F" x={32} y={90} w={96} h={64} rx={18} />
      <Wrist x={46} y={146} w={68} h={28} />
      {/* Middle, ring, pinky extended */}
      <ExtFinger x={68} y={16} w={20} h={78} rx={10} nail={{ x: 70, y: 18, w: 16, h: 16 }} />
      <ExtFinger x={48} y={22} w={18} h={72} rx={9} nail={{ x: 50, y: 24, w: 14, h: 15 }} />
      <ExtFinger x={29} y={28} w={16} h={66} rx={8} nail={{ x: 31, y: 30, w: 12, h: 14 }} />
      {/* Index curves down */}
      <path d="M 112 88 C 112 64, 106 44, 98 32 C 94 24, 90 20, 94 18 C 100 16, 106 22, 110 32"
            stroke={SKIN_BASE} strokeWidth="18" fill="none" strokeLinecap="round" />
      {/* Thumb curves up to meet index */}
      <path d="M 34 110 C 50 106, 72 96, 88 84 C 98 76, 104 74, 108 78"
            stroke={SKIN_MID} strokeWidth="16" fill="none" strokeLinecap="round" />
      {/* Circle gap */}
      <ellipse cx={100} cy={72} rx={10} ry={9} fill="white" opacity={0.85} />
      {/* Index nail hint */}
      <rect x={90} y={18} width={12} height={12} rx={4}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} opacity={0.9} />
    </svg>
  )
}

/** ASL_I — pinky only extended */
function Hand_PinchOrI(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="I" x={32} y={72} w={96} h={76} rx={20} />
      <Wrist x={46} y={140} w={68} h={30} />
      {/* Pinky extended */}
      <ExtFinger x={29} y={28} w={16} h={66} rx={8} nail={{ x: 31, y: 30, w: 12, h: 14 }} />
      {/* Other knuckles curled */}
      <ellipse cx={68} cy={68} rx={13} ry={10} fill={SKIN_SHADOW} transform="translate(1,2)" />
      <ellipse cx={68} cy={68} rx={13} ry={10} fill={SKIN_BASE} />
      <ellipse cx={90} cy={66} rx={14} ry={10} fill={SKIN_SHADOW} transform="translate(1,2)" />
      <ellipse cx={90} cy={66} rx={14} ry={10} fill={SKIN_BASE} />
      <ellipse cx={111} cy={70} rx={12} ry={9} fill={SKIN_SHADOW} transform="translate(1,2)" />
      <ellipse cx={111} cy={70} rx={12} ry={9} fill={SKIN_BASE} />
      {/* Thumb across front */}
      <rect x={33} y={98} width={58} height={18} rx={9} fill={SKIN_MID} />
      <rect x={74} y={99} width={14} height={14} rx={5}
            fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
    </svg>
  )
}

/** R — index + middle crossed */
function Hand_R(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="R" x={34} y={90} w={92} h={64} rx={18} />
      <Wrist x={48} y={146} w={64} h={28} />
      {/* Middle (behind — slightly darker) */}
      <g transform="rotate(-8, 88, 90)">
        <rect x={80} y={21} width={17} height={72} rx={9} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={79} y={18} width={18} height={74} rx={9} fill={SKIN_MID} />
        <rect x={81} y={20} width={14} height={14} rx={5}
              fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
      </g>
      {/* Index (in front, rotated over middle) */}
      <g transform="rotate(15, 96, 90)">
        <rect x={88} y={19} width={17} height={74} rx={9} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={87} y={16} width={18} height={76} rx={9} fill={SKIN_BASE} />
        <rect x={89} y={18} width={14} height={15} rx={5}
              fill={NAIL} stroke={NAIL_STROKE} strokeWidth={0.5} />
      </g>
      {/* Ring curled */}
      <CurlBump x={58} y={76} w={17} h={22} rx={8} />
      {/* Pinky curled */}
      <CurlBump x={39} y={80} w={15} h={19} rx={7} />
      {/* Thumb tucked */}
      <g transform="rotate(-25, 42, 118)">
        <rect x={28} y={104} width={16} height={32} rx={8} fill={SKIN_MID} />
      </g>
    </svg>
  )
}

/** U — index + middle side by side, others curled */
function Hand_U(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="U" x={34} y={90} w={92} h={64} rx={18} />
      <Wrist x={48} y={146} w={64} h={28} />
      {/* Index + middle together */}
      <ExtFinger x={84} y={16} w={18} h={78} rx={9} nail={{ x: 86, y: 18, w: 14, h: 15 }} />
      <ExtFinger x={104} y={14} w={20} h={78} rx={10} nail={{ x: 106, y: 16, w: 16, h: 16 }} />
      {/* Ring curled */}
      <CurlBump x={62} y={76} w={17} h={22} rx={8} />
      {/* Pinky curled */}
      <CurlBump x={43} y={80} w={15} h={19} rx={7} />
      {/* Thumb tucked */}
      <g transform="rotate(-25, 42, 118)">
        <rect x={28} y={104} width={16} height={32} rx={8} fill={SKIN_MID} />
      </g>
    </svg>
  )
}

/** Y / shaka — thumb + pinky extended, three middle curled */
function Hand_Y(): JSX.Element {
  return (
    <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
      <Palm id="Y" x={32} y={88} w={96} h={64} rx={18} />
      <Wrist x={46} y={144} w={68} h={28} />
      {/* Pinky extended */}
      <ExtFinger x={29} y={30} w={16} h={62} rx={8} nail={{ x: 31, y: 32, w: 12, h: 14 }} />
      {/* Thumb to side */}
      <g transform="rotate(-45, 38, 108)">
        <rect x={23} y={89} width={15} height={48} rx={8} fill={SKIN_SHADOW} transform="translate(2,3)" />
        <rect x={22} y={88} width={16} height={48} rx={8} fill={SKIN_BASE} />
        <rect x={24} y={90} width={12} height={14} rx={5} fill={NAIL} />
      </g>
      {/* Index curled knuckle */}
      <CurlBump x={94} y={80} w={18} h={22} rx={9} />
      {/* Middle curled */}
      <CurlBump x={70} y={72} w={19} h={24} rx={9} />
      {/* Ring curled */}
      <CurlBump x={50} y={76} w={17} h={21} rx={8} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP TABLE
// ─────────────────────────────────────────────────────────────────────────────

const GESTURE_TO_HAND: Record<string, () => JSX.Element> = {
  // Quick responses
  'Thumb_Up':     Hand_ThumbsUp,
  'Thumb_Down':   Hand_ThumbsDown,
  'Open_Palm':    Hand_OpenPalm,
  'Closed_Fist':  Hand_ClosedFist,
  'Victory':      Hand_Victory,
  'ILoveYou':     Hand_ILoveYou,
  'Pointing_Up':  Hand_PointingUp,
  // Alphabet
  'ASL_A':        Hand_ClosedFist,
  'ASL_B':        Hand_B,
  'ASL_C':        Hand_O,
  'ASL_D':        Hand_PointingUp,
  'ASL_E':        Hand_ClosedFist,
  'ASL_F':        Hand_OKorF,
  'ASL_G':        Hand_L,
  'ASL_H':        Hand_U,
  'ASL_I':        Hand_PinchOrI,
  'ASL_K':        Hand_Victory,
  'ASL_L':        Hand_L,
  'ASL_M':        Hand_ClosedFist,
  'ASL_N':        Hand_ClosedFist,
  'ASL_O':        Hand_O,
  'ASL_R':        Hand_R,
  'ASL_S':        Hand_ClosedFist,
  'ASL_U':        Hand_U,
  'ASL_W':        Hand_ThreeFingers,
  'ASL_Y':        Hand_Y,
  // Numbers
  'ASL_0':        Hand_O,
  'ASL_1':        Hand_PointingUp,
  'ASL_2':        Hand_Victory,
  'ASL_3':        Hand_ThreeFingers,
  'ASL_4':        Hand_B,
  'ASL_5':        Hand_OpenPalm,
  'ASL_6':        Hand_OKorF,
  'ASL_7':        Hand_OKorF,
  'ASL_8':        Hand_OKorF,
  'ASL_9':        Hand_OKorF,
  // Common phrases
  'ASL_PLEASE':   Hand_OpenPalm,
  'ASL_THANKYOU': Hand_OpenPalm,
  'ASL_SORRY':    Hand_ClosedFist,
  'ASL_HELP':     Hand_ThumbsUp,
  'ASL_MORE':     Hand_OKorF,
  'ASL_FINISHED': Hand_OpenPalm,
  'ASL_WATER':    Hand_ThreeFingers,
  'ASL_EAT':      Hand_OKorF,
  'ASL_PAIN':     Hand_PointingUp,
  'ASL_BATHROOM': Hand_ClosedFist,
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface HandDiagramProps {
  gestureKey: string
  size?: 'sm' | 'md' | 'lg'
}

export function HandDiagram({ gestureKey, size = 'md' }: HandDiagramProps) {
  const HandComponent = GESTURE_TO_HAND[gestureKey]

  const scale = size === 'sm' ? 0.55 : size === 'lg' ? 1.0 : 0.75
  const w = Math.round(140 * scale)
  const h = Math.round(157 * scale)

  if (!HandComponent) {
    return (
      <svg viewBox="0 0 160 180" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        <rect x={34} y={72} width={92} height={80} rx={20} fill="#e2e8f0" />
        <rect x={48} y={144} width={64} height={28} rx={12} fill="#cbd5e1" />
        <text x={80} y={120} textAnchor="middle" fontSize={32} fill="#94a3b8">?</text>
      </svg>
    )
  }

  return (
    <div style={{ width: w, height: h, overflow: 'hidden', display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left',
                    width: 140, height: 157 }}>
        <HandComponent />
      </div>
    </div>
  )
}
