import { useMemo } from 'react'
import * as THREE from 'three'
import { Clouds, Cloud } from '@react-three/drei'

/* drei's default cloud texture comes from a CDN — generate an
   equivalent soft radial puff locally so nothing depends on the network */
const makePuffTexture = () => {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.85)')
  g.addColorStop(0.75, 'rgba(255,255,255,0.3)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return canvas.toDataURL('image/png')
}

/* Drifting cumulus layer. Positions avoid Skypiea's column (-14, -79). */
const CLOUD_SPOTS = [
  [-120, 55, -30], [60, 50, -70], [150, 60, 20],
  [-60, 52, 60], [10, 58, 85], [-160, 62, 10], [110, 48, 75],
]

const CloudsLayer = () => {
  const texture = useMemo(() => makePuffTexture(), [])

  return (
    <Clouds material={THREE.MeshLambertMaterial} texture={texture} limit={200}>
      {CLOUD_SPOTS.map(([x, y, z], i) => (
        <Cloud
          key={i}
          position={[x, y, z]}
          seed={i + 1}
          segments={14}
          bounds={[26, 5, 22]}
          volume={16}
          opacity={0.45}
          speed={0.12}
          color="#FFFFFF"
        />
      ))}
    </Clouds>
  )
}

export default CloudsLayer
