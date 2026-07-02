import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { SAGA_COLORS } from '../../constants/world3d'

// Animated dashed route over the water connecting the saga's islands in order
const JourneyRoute = ({ waypoints, activeSaga }) => {
  const lineRef = useRef(null)

  const points = useMemo(() => {
    if (!waypoints || waypoints.length < 2) return null
    const pts = waypoints.map(([x, , z]) => new THREE.Vector3(x, 1.4, z))
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5)
    return curve.getPoints(Math.max(80, waypoints.length * 14))
  }, [waypoints])

  useFrame((_, dt) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset -= dt * 6
    }
  })

  if (!points) return null

  const color = activeSaga ? SAGA_COLORS[activeSaga] : '#F0B429'

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={2.5}
      dashed
      dashSize={2.2}
      gapSize={1.6}
      transparent
      opacity={0.85}
    />
  )
}

export default JourneyRoute
