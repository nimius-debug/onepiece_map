import { useEffect, useRef, useState } from 'react'

const JourneyPath = ({ locations, activeSaga, containerSize }) => {
  const pathRef = useRef(null)
  const ghostRef = useRef(null)
  const [drawn, setDrawn] = useState(false)

  const sorted = [...locations].sort((a, b) => a.order - b.order)

  const toPixel = (loc) => ({
    x: (loc.x / 100) * containerSize.width,
    y: (loc.y / 100) * containerSize.height,
  })

  const buildPath = (locs) => {
    if (locs.length < 2) return ''
    const pts = locs.map(toPixel)
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const cx1 = prev.x + (curr.x - prev.x) * 0.5
      const cy1 = prev.y
      const cx2 = prev.x + (curr.x - prev.x) * 0.5
      const cy2 = curr.y
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`
    }
    return d
  }

  const pathD = buildPath(sorted)

  // Animate on mount or when path changes
  useEffect(() => {
    setDrawn(false)
    const t = setTimeout(() => setDrawn(true), 100)
    return () => clearTimeout(t)
  }, [activeSaga, containerSize.width])

  useEffect(() => {
    if (!drawn || !pathRef.current) return
    const length = pathRef.current.getTotalLength()
    pathRef.current.style.strokeDasharray = `${length}`
    pathRef.current.style.strokeDashoffset = `${length}`
    // Force reflow then animate
    pathRef.current.getBoundingClientRect()
    pathRef.current.style.transition = 'stroke-dashoffset 3.5s cubic-bezier(0.4,0,0.2,1)'
    pathRef.current.style.strokeDashoffset = '0'
  }, [drawn, pathD])

  if (!containerSize.width || sorted.length < 2) return null

  return (
    <svg
      className="path-overlay"
      width={containerSize.width}
      height={containerSize.height}
    >
      {/* Ghost path — full route at low opacity */}
      <path
        ref={ghostRef}
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1.5"
        strokeDasharray="5,8"
      />

      {/* Animated path */}
      {drawn && (
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={activeSaga ? 'var(--saga-' + sagaKey(activeSaga) + ')' : 'rgba(240,180,41,0.65)'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 3px rgba(240,180,41,0.4))' }}
        />
      )}

      {/* Dot at each visited point */}
      {sorted.map((loc) => {
        const pt = toPixel(loc)
        return (
          <circle
            key={loc.id}
            cx={pt.x}
            cy={pt.y}
            r={3}
            fill="rgba(240,180,41,0.35)"
            style={{ pointerEvents: 'none' }}
          />
        )
      })}
    </svg>
  )
}

const sagaKey = (saga) => {
  const map = {
    'East Blue':      'east',
    'Alabasta':       'alabasta',
    'Skypiea':        'skypiea',
    'Water 7':        'water7',
    'Summit War':     'summit',
    'Fishman Island': 'fishman',
    'New World':      'newworld',
  }
  return map[saga] ?? 'east'
}

export default JourneyPath
