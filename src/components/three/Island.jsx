import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import {
  locTo3D, SAGA_COLORS, SKY_ISLANDS, UNDERSEA_ISLANDS, SKY_ALTITUDE, LABEL_FONT,
} from '../../constants/world3d'

// Deterministic pseudo-random from a string id — keeps island shapes
// stable between renders without Math.random()
const hashSeed = (str) => {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

const PALM_GREEN = '#2E8B47'
const SAND = '#D9BE7E'
const ROCK = '#B4915A'

const PalmTree = ({ position, scale = 1, rnd }) => {
  const lean = (rnd() - 0.5) * 0.5
  return (
    <group position={position} scale={scale} rotation={[0, rnd() * Math.PI * 2, lean]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, 1.8, 5]} />
        <meshStandardMaterial color="#7A5230" roughness={1} flatShading />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[0, 1.85, 0]}
          rotation={[0.55, (i / 5) * Math.PI * 2, 0]}
          castShadow
        >
          <coneGeometry args={[0.16, 1.1, 4]} />
          <meshStandardMaterial color={PALM_GREEN} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  )
}

const Island = ({ location, isActive, isDimmed, onHover, onLeave, onClick, onFlyTo }) => {
  const groupRef = useRef(null)
  const pinRef = useRef(null)
  const ringRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const isSky = SKY_ISLANDS.has(location.id)
  const isUndersea = UNDERSEA_ISLANDS.has(location.id)
  const [wx, , wz] = locTo3D(location)
  const baseY = isSky ? SKY_ALTITUDE : 0
  const sagaColor = SAGA_COLORS[location.saga] ?? '#F0B429'

  // Build stable island geometry per location
  const { peaks, trees, size } = useMemo(() => {
    const rnd = hashSeed(location.id)
    const size = 2.2 + rnd() * 2.2
    const peakCount = 2 + Math.floor(rnd() * 3)
    const peaks = Array.from({ length: peakCount }, () => ({
      x: (rnd() - 0.5) * size * 0.9,
      z: (rnd() - 0.5) * size * 0.9,
      r: size * (0.35 + rnd() * 0.3),
      h: size * (0.7 + rnd() * 0.9),
      rot: rnd() * Math.PI,
    }))
    const treeCount = 1 + Math.floor(rnd() * 3)
    const trees = Array.from({ length: treeCount }, () => ({
      x: (rnd() - 0.5) * size * 1.3,
      z: (rnd() - 0.5) * size * 1.3,
      s: 0.7 + rnd() * 0.5,
      rnd,
    }))
    return { peaks, trees, size }
  }, [location.id])

  // Bob the whole sky island; pulse the marker pin + ring
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (groupRef.current && isSky) {
      groupRef.current.position.y = baseY + Math.sin(t * 0.7 + wx) * 1.2
    }
    if (pinRef.current) {
      pinRef.current.position.y = size * 1.9 + 1.6 + Math.sin(t * 2.2 + wz) * 0.35
    }
    if (ringRef.current) {
      const pulse = 1 + 0.25 * Math.sin(t * 3)
      ringRef.current.scale.setScalar(isActive ? pulse * 1.3 : pulse)
    }
  })

  const opacity = isDimmed ? 0.25 : 1
  const emissive = hovered || isActive ? sagaColor : '#000000'
  const emissiveIntensity = isActive ? 0.5 : hovered ? 0.3 : 0

  return (
    <group
      ref={groupRef}
      position={[wx, baseY, wz]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
        onHover(location, { x: e.clientX, y: e.clientY })
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
        onLeave()
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(location, { x: e.clientX, y: e.clientY })
        onFlyTo?.([wx, baseY, wz], size)
      }}
    >
      {/* Sand base */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[size * 1.35, size * 1.6, 0.6, 9]} />
        <meshStandardMaterial
          color={SAND} roughness={1} flatShading
          transparent opacity={opacity}
          emissive={emissive} emissiveIntensity={emissiveIntensity * 0.4}
        />
      </mesh>

      {/* Rocky peaks */}
      {peaks.map((p, i) => (
        <mesh key={i} position={[p.x, 0.3, p.z]} rotation={[0, p.rot, 0]} castShadow>
          <coneGeometry args={[p.r, p.h, 6]} />
          <meshStandardMaterial
            color={ROCK} roughness={1} flatShading
            transparent opacity={opacity}
            emissive={emissive} emissiveIntensity={emissiveIntensity * 0.4}
          />
        </mesh>
      ))}

      {/* Palm trees */}
      {!isDimmed && trees.map((t, i) => (
        <PalmTree key={i} position={[t.x, 0.3, t.z]} scale={t.s} rnd={t.rnd} />
      ))}

      {/* Sky island cloud puffs */}
      {isSky && (
        <group position={[0, -0.7, 0]}>
          {[[-1.8, 0, 0.4, 1.7], [1.5, -0.3, -0.5, 1.9], [0, -0.5, 1.2, 2.2], [0.4, 0.1, -1.5, 1.5]].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[r, 8, 6]} />
              <meshStandardMaterial color="#FFFFFF" roughness={1} transparent opacity={0.92 * opacity} flatShading />
            </mesh>
          ))}
        </group>
      )}

      {/* Fishman Island bubble dome */}
      {isUndersea && (
        <mesh position={[0, size * 0.8, 0]}>
          <sphereGeometry args={[size * 1.9, 20, 14]} />
          <meshPhysicalMaterial
            color="#7FDBFF" transparent opacity={0.18 * opacity}
            roughness={0.05} metalness={0} transmission={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Floating marker pin */}
      <group ref={pinRef} position={[0, size * 1.9 + 1.6, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.55, 12, 10]} />
          <meshStandardMaterial
            color={sagaColor} emissive={sagaColor}
            emissiveIntensity={isDimmed ? 0.05 : 0.65}
            transparent opacity={opacity}
          />
        </mesh>
        <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.3, 1.1, 8]} />
          <meshStandardMaterial
            color={sagaColor} emissive={sagaColor}
            emissiveIntensity={isDimmed ? 0.05 : 0.4}
            transparent opacity={opacity}
          />
        </mesh>
        {/* Pulsing halo ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
          <torusGeometry args={[1.1, 0.06, 8, 32]} />
          <meshBasicMaterial color={sagaColor} transparent opacity={isDimmed ? 0.1 : 0.6} />
        </mesh>
      </group>

      {/* Name label — always faces camera */}
      <Billboard position={[0, size * 1.9 + 3.6, 0]}>
        <Text
          font={LABEL_FONT}
          fontSize={hovered || isActive ? 1.5 : 1.1}
          color={isDimmed ? '#9a9a9a' : '#FFF6E0'}
          outlineWidth={0.09}
          outlineColor="#1A0C04"
          anchorX="center"
          anchorY="bottom"
          fillOpacity={isDimmed ? 0.35 : 1}
          outlineOpacity={isDimmed ? 0.35 : 1}
        >
          {location.name}
        </Text>
      </Billboard>
    </group>
  )
}

export default Island
