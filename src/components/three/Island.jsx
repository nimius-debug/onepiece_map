import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import {
  SAGA_COLORS, SKY_ISLANDS, UNDERSEA_ISLANDS, LABEL_FONT,
} from '../../constants/world3d'
import { locAnchor } from '../../terrain/heightfield'
import { fbm } from '../../utils/noise'

/* The terrain itself is one big mesh with no pointer handlers
   (raycast perf) — each location carries an invisible hitbox that
   receives all hover/click events instead. */

const PIN_Y = 5.5
const HALO_Y = 4
const LABEL_Y = 8

/* Floating sky island disc for Skypiea — the heightfield can't float */
const SkyIslandDisc = () => {
  const geo = useMemo(() => {
    const g = new THREE.CircleGeometry(7, 48)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const d = Math.sqrt(x * x + z * z)
      const rim = Math.max(0, 1 - d / 7)
      pos.setY(i, 1.6 * rim + 1.2 * rim * fbm(x * 2, z * 2, { freq: 0.3, octaves: 3 }))
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <group>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#6FA85A" roughness={0.9} />
      </mesh>
      {/* underside cloud puffs */}
      {[[-2.5, -1.2, 1.0, 2.6], [2.2, -1.5, -0.8, 2.9], [0, -1.8, 1.8, 3.2], [0.6, -0.9, -2.2, 2.2]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 10, 8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={1} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

const Island = ({ location, isActive, isDimmed, onHover, onLeave, onClick, onFlyTo }) => {
  const pinRef = useRef(null)
  const ringRef = useRef(null)
  const groupRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const isSky = SKY_ISLANDS.has(location.id)
  const isUndersea = UNDERSEA_ISLANDS.has(location.id)
  const [wx, anchorY, wz] = useMemo(() => locAnchor(location), [location])
  const sagaColor = SAGA_COLORS[location.saga] ?? '#F0B429'

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (groupRef.current && isSky) {
      groupRef.current.position.y = anchorY + Math.sin(t * 0.7 + wx) * 1.2
    }
    if (pinRef.current) {
      pinRef.current.position.y = PIN_Y + Math.sin(t * 2.2 + wz) * 0.35
    }
    if (ringRef.current) {
      const pulse = 1 + 0.25 * Math.sin(t * 3)
      ringRef.current.scale.setScalar(isActive ? pulse * 1.3 : pulse)
    }
  })

  const opacity = isDimmed ? 0.25 : 1

  return (
    <group
      ref={groupRef}
      position={[wx, anchorY, wz]}
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
        onFlyTo?.([wx, anchorY, wz], location)
      }}
    >
      {/* Invisible hitbox — carries ALL pointer events for this location.
          (three r185 raycasts invisible meshes fine) */}
      <mesh visible={false} position={[0, 4, 0]}>
        <cylinderGeometry args={[5, 5, 12]} />
      </mesh>

      {isSky && <SkyIslandDisc />}

      {/* Fishman Island bubble dome — rests on the seabed, visible
          through the transparent water above it */}
      {isUndersea && (
        <mesh renderOrder={3}>
          <sphereGeometry args={[6, 24, 16]} />
          <meshPhysicalMaterial
            color="#7FDBFF" transparent opacity={0.22 * opacity}
            roughness={0.05} metalness={0} transmission={0.55}
            side={THREE.DoubleSide} depthWrite={false}
          />
        </mesh>
      )}

      {/* Floating marker pin */}
      <group ref={pinRef} position={[0, PIN_Y, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.55, 14, 12]} />
          <meshStandardMaterial
            color={sagaColor} emissive={sagaColor}
            emissiveIntensity={isDimmed ? 0.05 : hovered || isActive ? 1.0 : 0.6}
            transparent opacity={opacity}
          />
        </mesh>
        <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.3, 1.1, 10]} />
          <meshStandardMaterial
            color={sagaColor} emissive={sagaColor}
            emissiveIntensity={isDimmed ? 0.05 : 0.4}
            transparent opacity={opacity}
          />
        </mesh>
      </group>

      {/* Pulsing halo ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, HALO_Y, 0]} renderOrder={2}>
        <torusGeometry args={[1.1, 0.06, 8, 32]} />
        <meshBasicMaterial color={sagaColor} transparent opacity={isDimmed ? 0.1 : 0.6} depthWrite={false} />
      </mesh>

      {/* Name label — always faces camera */}
      <Billboard position={[0, LABEL_Y, 0]}>
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
          renderOrder={10}
        >
          {location.name}
        </Text>
      </Billboard>
    </group>
  )
}

export default Island
