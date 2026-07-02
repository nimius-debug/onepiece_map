import { useMemo } from 'react'
import * as THREE from 'three'
import { WORLD_W, WORLD_H, RL1_X, RL2_X, GL_Z } from '../../constants/world3d'
import { terrainHeight } from '../../terrain/heightfield'
import { fbm } from '../../utils/noise'

/* Biome colors */
const C = {
  deepSea: new THREE.Color('#22404E'),
  wetSand: new THREE.Color('#B9A678'),
  beach:   new THREE.Color('#DECC9C'),
  grass:   new THREE.Color('#55913F'),
  forest:  new THREE.Color('#31703A'),
  rock:    new THREE.Color('#8A8075'),
  rlRock:  new THREE.Color('#9A4A30'),   // Red Line red-brown
  snow:    new THREE.Color('#EEF1F4'),
}

const smoothstep = (e0, e1, v) => {
  const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

const biomeColor = (out, x, z, h, slope) => {
  // stack the bands bottom-up with soft blends
  out.copy(C.deepSea)
  out.lerp(C.wetSand, smoothstep(-4.6, -3.4, h))
  out.lerp(C.beach, smoothstep(-0.65, -0.05, h))
  out.lerp(C.grass, smoothstep(0.5, 1.1, h))
  out.lerp(C.forest, smoothstep(3.4, 4.6, h))

  // rock: high altitude or steep slope
  const nearRL = Math.min(Math.abs(x - RL1_X), Math.abs(x - RL2_X)) < 14
  const rock = nearRL ? C.rlRock : C.rock
  out.lerp(rock, Math.max(smoothstep(8, 10, h), smoothstep(0.42, 0.55, slope)))

  // snow caps
  out.lerp(C.snow, smoothstep(16, 20, h))

  // luminance jitter to kill banding
  const j = 1 + 0.06 * fbm(x, z, { freq: 0.3, octaves: 2 })
  out.multiplyScalar(j)
  return out
}

/* One continuous heightfield mesh for the whole world.
   Never attach pointer handlers here — 276k triangles must stay
   out of the per-pointermove raycast (Islands carry hitboxes). */
const Terrain = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD_W, WORLD_H, 500, 276)
    geo.rotateX(-Math.PI / 2) // world XZ before displacement
    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i)))
    }
    geo.computeVertexNormals() // smooth shading — no low-poly facets

    const colors = new Float32Array(pos.count * 3)
    const normal = geo.attributes.normal
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const slope = 1 - normal.getY(i)
      biomeColor(c, pos.getX(i), pos.getZ(i), pos.getY(i), slope)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.96} metalness={0} />
    </mesh>
  )
}

/* Mary Geoise — citadel on the Red Line at the holy land */
export const MaryGeoise = () => {
  const pos = useMemo(() => {
    const x = RL2_X
    const z = GL_Z - 40
    return [x, terrainHeight(x, z), z]
  }, [])

  return (
    <group position={pos}>
      <mesh castShadow>
        <cylinderGeometry args={[2.4, 3.4, 5, 8]} />
        <meshStandardMaterial color="#D9C58A" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0, 3.6, 0]} castShadow>
        <coneGeometry args={[2, 3, 8]} />
        <meshStandardMaterial color="#B89A50" roughness={0.6} />
      </mesh>
      <mesh position={[0, 5.4, 0]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshStandardMaterial color="#E8D590" emissive="#C0A040" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

export default Terrain
