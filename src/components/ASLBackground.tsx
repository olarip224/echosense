import { useEffect, useRef } from 'react'

const POSES: Record<string, number[][]> = {
  A: [[50,120],[32,105],[22,96],[18,86],[24,78],[38,78],[44,68],[48,62],[46,58],[50,75],[56,66],[60,60],[57,56],[62,77],[68,69],[70,64],[67,60],[72,82],[76,75],[77,71],[74,68]],
  B: [[50,120],[32,105],[22,98],[20,90],[26,84],[38,78],[34,58],[31,42],[29,28],[50,75],[49,54],[48,38],[47,24],[62,77],[63,57],[64,41],[65,27],[72,82],[75,65],[77,52],[79,40]],
  C: [[50,120],[32,105],[20,94],[12,82],[16,70],[38,78],[30,62],[26,48],[28,38],[50,75],[46,58],[44,46],[46,37],[62,77],[64,61],[65,50],[63,41],[72,82],[76,68],[78,58],[77,50]],
  D: [[50,120],[32,105],[24,97],[18,87],[28,80],[38,78],[34,58],[31,42],[29,28],[50,75],[54,66],[56,62],[52,58],[62,77],[68,70],[70,65],[67,61],[72,82],[76,75],[77,71],[74,68]],
  I: [[50,120],[32,105],[22,96],[18,86],[24,78],[38,78],[44,68],[48,62],[46,58],[50,75],[56,66],[60,60],[57,56],[62,77],[68,69],[70,64],[67,60],[72,82],[75,65],[77,52],[79,40]],
  L: [[50,120],[32,105],[22,96],[14,88],[6,82],[38,78],[34,58],[31,42],[29,28],[50,75],[56,66],[60,60],[57,56],[62,77],[68,69],[70,64],[67,60],[72,82],[76,75],[77,71],[74,68]],
  O: [[50,120],[32,105],[20,94],[14,82],[24,72],[38,78],[32,64],[28,52],[30,44],[50,75],[46,60],[44,48],[46,40],[62,77],[64,62],[64,50],[60,42],[72,82],[76,70],[78,62],[76,56]],
  V: [[50,120],[32,105],[22,98],[20,90],[26,84],[38,78],[34,58],[31,42],[29,28],[50,75],[49,54],[48,38],[47,24],[62,77],[68,69],[70,64],[67,60],[72,82],[76,75],[77,71],[74,68]],
  W: [[50,120],[32,105],[22,98],[20,90],[26,84],[38,78],[34,58],[31,42],[29,28],[50,75],[49,54],[48,38],[47,24],[62,77],[63,57],[64,41],[65,27],[72,82],[76,75],[77,71],[74,68]],
  Y: [[50,120],[32,105],[22,96],[14,88],[6,82],[38,78],[44,68],[48,62],[46,58],[50,75],[56,66],[60,60],[57,56],[62,77],[68,69],[70,64],[67,60],[72,82],[75,65],[77,52],[79,40]],
}

const CONN: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
]

// Hand positions around the perimeter of the screen.
// px/py are 0–1 fractions of screen width/height.
// sc = scale, ang = rotation degrees, op = opacity.
const HANDS = [
  { px: 0.04, py: 0.08, sc: 1.20, ang: -32, op: 0.22 },
  { px: 0.22, py: 0.05, sc: 1.35, ang:  10, op: 0.26 },
  { px: 0.50, py: 0.06, sc: 1.15, ang: -14, op: 0.20 },
  { px: 0.76, py: 0.07, sc: 1.30, ang:  26, op: 0.24 },
  { px: 0.94, py: 0.12, sc: 1.20, ang: -20, op: 0.22 },
  { px: 0.91, py: 0.38, sc: 1.40, ang:  18, op: 0.26 },
  { px: 0.95, py: 0.65, sc: 1.25, ang: -30, op: 0.21 },
  { px: 0.84, py: 0.88, sc: 1.30, ang:  14, op: 0.24 },
  { px: 0.58, py: 0.92, sc: 1.20, ang: -18, op: 0.22 },
  { px: 0.32, py: 0.90, sc: 1.35, ang:  28, op: 0.26 },
  { px: 0.08, py: 0.86, sc: 1.15, ang: -10, op: 0.20 },
  { px: 0.03, py: 0.60, sc: 1.30, ang:  22, op: 0.24 },
  { px: 0.06, py: 0.36, sc: 1.20, ang: -25, op: 0.21 },
  { px: 0.35, py: 0.32, sc: 1.10, ang:  12, op: 0.16 },
  { px: 0.64, py: 0.42, sc: 1.15, ang: -16, op: 0.18 },
  { px: 0.48, py: 0.60, sc: 1.05, ang:  30, op: 0.14 },
]

const POSE_KEYS = Object.keys(POSES)

// Sage green at low opacity — feels like a watermark against --bg.
const LINE_COLOR = 'rgba(26, 77, 58, 0.55)'
const DOT_COLOR  = 'rgba(26, 77, 58, 0.65)'
const DOT_WHITE  = 'rgba(247, 245, 242, 0.95)'

function drawHand(
  ctx: CanvasRenderingContext2D,
  pts: number[][],
  cx: number,
  cy: number,
  sc: number,
  angDeg: number,
  op: number,
) {
  const ang = (angDeg * Math.PI) / 180
  ctx.save()
  ctx.globalAlpha = op
  ctx.translate(cx, cy)
  ctx.rotate(ang)
  ctx.scale(sc, sc)
  ctx.translate(-50, -90)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 1.6 / sc
  ctx.strokeStyle = LINE_COLOR

  // Skeleton
  CONN.forEach(([a, b]) => {
    ctx.beginPath()
    ctx.moveTo(pts[a][0], pts[a][1])
    ctx.lineTo(pts[b][0], pts[b][1])
    ctx.stroke()
  })

  // Landmark dots: sage outer + warm-white inner
  const dotR = 3.5 / sc
  const innerR = 1.8 / sc
  pts.forEach((pt) => {
    ctx.beginPath()
    ctx.arc(pt[0], pt[1], dotR, 0, Math.PI * 2)
    ctx.fillStyle = DOT_COLOR
    ctx.fill()

    ctx.beginPath()
    ctx.arc(pt[0], pt[1], innerR, 0, Math.PI * 2)
    ctx.fillStyle = DOT_WHITE
    ctx.fill()
  })

  ctx.restore()
}

export function ASLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function draw() {
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const W = canvas.width
      const H = canvas.height

      // Scale relative to a 1440px reference width
      const ratio = W / 1440

      HANDS.forEach((h, i) => {
        const poseKey = POSE_KEYS[i % POSE_KEYS.length]
        drawHand(
          ctx,
          POSES[poseKey],
          h.px * W,
          h.py * H,
          h.sc * ratio,
          h.ang,
          h.op,
        )
      })
    }

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // Sits behind everything — z-index 0. All app content z-index 1+.
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
