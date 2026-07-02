import { useEffect, useRef, useState } from 'react'
import { MAP_W, MAP_H } from '../constants/mapConfig'

const sagaKey = (saga) => ({
  'East Blue':      'east',
  'Alabasta':       'alabasta',
  'Skypiea':        'skypiea',
  'Water 7':        'water7',
  'Summit War':     'summit',
  'Fishman Island': 'fishman',
  'New World':      'newworld',
}[saga] ?? 'east')

const toPixel = (loc) => ({
  x: (loc.x / 100) * MAP_W,
  y: (loc.y / 100) * MAP_H,
})

const buildPath = (locs) => {
  if (locs.length < 2) return ''
  const pts = locs.map(toPixel)
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cx1 = prev.x + (curr.x - prev.x) * 0.45
    const cx2 = prev.x + (curr.x - prev.x) * 0.55
    d += ` C ${cx1} ${prev.y}, ${cx2} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
}

const JourneyPath = ({ locations, activeSaga }) => {
  const pathRef  = useRef(null)
  const [drawn, setDrawn] = useState(false)

  const sorted = [...locations].sort((a, b) => a.order - b.order)
  const pathD  = buildPath(sorted)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset to retrigger the draw-on animation
    setDrawn(false)
    const t = setTimeout(() => setDrawn(true), 120)
    return () => clearTimeout(t)
  }, [activeSaga, pathD])

  useEffect(() => {
    if (!drawn || !pathRef.current) return
    const length = pathRef.current.getTotalLength()
    pathRef.current.style.strokeDasharray  = `${length}`
    pathRef.current.style.strokeDashoffset = `${length}`
    pathRef.current.getBoundingClientRect() // force reflow
    pathRef.current.style.transition       = 'stroke-dashoffset 3.8s cubic-bezier(0.4,0,0.2,1)'
    pathRef.current.style.strokeDashoffset = '0'
  }, [drawn, pathD])

  if (sorted.length < 2) return null

  const strokeColor = activeSaga
    ? `var(--saga-${sagaKey(activeSaga)})`
    : 'rgba(240,180,41,0.65)'

  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}
      width={MAP_W}
      height={MAP_H}
    >
      {/* Ghost path — full route, very faint */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.8"
        strokeDasharray="6,10"
      />

      {/* Animated draw-on path */}
      {drawn && (
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(240,180,41,0.45))' }}
        />
      )}

      {/* Dot at each location */}
      {sorted.map((loc) => {
        const pt = toPixel(loc)
        return (
          <circle
            key={loc.id}
            cx={pt.x}
            cy={pt.y}
            r={4}
            fill="rgba(240,180,41,0.32)"
          />
        )
      })}
    </svg>
  )
}

export default JourneyPath
