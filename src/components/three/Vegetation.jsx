import { useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import locationsData from '../../data/locations.json'
import { WORLD_W, WORLD_H, SKY_ISLANDS, locTo3D } from '../../constants/world3d'
import { terrainHeight } from '../../terrain/heightfield'
import { mulberry32, fbm } from '../../utils/noise'

/* Bake a vertex color onto a geometry so merged shapes can share
   one vertexColors material */
const colored = (geo, hex) => {
  const c = new THREE.Color(hex)
  const n = geo.attributes.position.count
  const colors = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geo
}

const treeGeometry = () => {
  const trunk = colored(new THREE.CylinderGeometry(0.08, 0.14, 0.9, 5).translate(0, 0.45, 0), '#6B4A2A')
  const lower = colored(new THREE.ConeGeometry(0.65, 1.3, 6).translate(0, 1.35, 0), '#2F6B33')
  const upper = colored(new THREE.ConeGeometry(0.42, 1.0, 6).translate(0, 2.1, 0), '#3B7C3C')
  return mergeGeometries([trunk, lower, upper])
}

const palmGeometry = () => {
  const trunk = colored(
    new THREE.CylinderGeometry(0.07, 0.12, 1.7, 5).translate(0, 0.85, 0).rotateZ(0.18),
    '#7A5230',
  )
  const blades = []
  for (let i = 0; i < 5; i++) {
    blades.push(colored(
      new THREE.ConeGeometry(0.15, 1.05, 4)
        .translate(0, 0.5, 0)
        .rotateX(1.05)
        .rotateY((i / 5) * Math.PI * 2)
        .translate(0.28, 1.72, 0),
      '#2E8B47',
    ))
  }
  return mergeGeometries([trunk, ...blades])
}

const rockGeometry = () => colored(new THREE.IcosahedronGeometry(0.5, 0), '#7D746A')

const slopeAt = (x, z) => {
  const e = 1.0
  const h = terrainHeight(x, z)
  const hx = terrainHeight(x + e, z)
  const hz = terrainHeight(x, z + e)
  return Math.max(Math.abs(hx - h), Math.abs(hz - h)) / e
}

const ANCHOR_XZ = locationsData.locations
  .filter((l) => !SKY_ISLANDS.has(l.id))
  .map((l) => { const [x, , z] = locTo3D(l); return [x, z] })

const nearAnchor = (x, z, r = 14) =>
  ANCHOR_XZ.some(([ax, az]) => (x - ax) ** 2 + (z - az) ** 2 < r * r)

/* Rejection-sample instance transforms on suitable land */
const scatter = ({ seed, count, minH, maxH, maxSlope, groveMask, anchorBias, yOffset = -0.15 }) => {
  const rng = mulberry32(seed)
  const dummy = new THREE.Object3D()
  const matrices = []
  let attempts = 0
  const maxAttempts = count * 60

  while (matrices.length < count && attempts < maxAttempts) {
    attempts++
    let x = (rng() - 0.5) * WORLD_W
    let z = (rng() - 0.5) * WORLD_H
    // bias a share of samples toward the story islands
    if (anchorBias && rng() < 0.75) {
      const [ax, az] = ANCHOR_XZ[Math.floor(rng() * ANCHOR_XZ.length)]
      x = ax + (rng() - 0.5) * 22
      z = az + (rng() - 0.5) * 22
    }
    const h = terrainHeight(x, z)
    if (h < minH || h > maxH) continue
    if (slopeAt(x, z) > maxSlope) continue
    if (groveMask && fbm(x, z, { freq: 0.05, octaves: 3 }) < 0.05) continue
    if (anchorBias && !nearAnchor(x, z) && rng() < 0.6) continue

    dummy.position.set(x, h + yOffset, z)
    dummy.rotation.y = rng() * Math.PI * 2
    const s = 0.7 + rng() * 0.9
    dummy.scale.set(s, s, s)
    dummy.updateMatrix()
    matrices.push(dummy.matrix.clone())
  }
  return matrices
}

const InstancedLayer = ({ geometry, matrices, castShadow = false }) => {
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(
      geometry,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }),
      matrices.length,
    )
    matrices.forEach((mat, i) => m.setMatrixAt(i, mat))
    m.instanceMatrix.needsUpdate = true
    m.castShadow = castShadow
    m.raycast = () => null
    return m
  }, [geometry, matrices, castShadow])

  return <primitive object={mesh} />
}

const Vegetation = () => {
  const layers = useMemo(() => ([
    {
      key: 'trees',
      geometry: treeGeometry(),
      matrices: scatter({ seed: 2024, count: 2500, minH: 1.0, maxH: 8.5, maxSlope: 0.9, groveMask: true }),
      castShadow: true,
    },
    {
      key: 'palms',
      geometry: palmGeometry(),
      matrices: scatter({ seed: 4048, count: 700, minH: 0.4, maxH: 2.2, maxSlope: 0.9, anchorBias: true }),
      castShadow: true,
    },
    {
      key: 'rocks',
      geometry: rockGeometry(),
      matrices: scatter({ seed: 8096, count: 900, minH: 0.5, maxH: 16, maxSlope: 2.5 }),
    },
  ]), [])

  return (
    <>
      {layers.map((l) => (
        <InstancedLayer key={l.key} geometry={l.geometry} matrices={l.matrices} castShadow={l.castShadow} />
      ))}
    </>
  )
}

export default Vegetation
