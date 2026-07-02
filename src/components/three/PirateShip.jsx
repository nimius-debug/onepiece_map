import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_W, WORLD_H } from '../../constants/world3d'
import { waveHeight } from '../../terrain/waves'
import { terrainHeight, seekWater } from '../../terrain/heightfield'

const WOOD = '#6B4226'
const WOOD_DARK = '#4A2C16'
const WOOD_LIGHT = '#8A5A34'
const SAIL = '#F5EBD8'

const ShipModel = () => {
  // curved hull profile via lathe-like segments
  const hullGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-2.4, 0.1)
    shape.quadraticCurveTo(-2.6, 1.0, -2.2, 1.35)
    shape.lineTo(2.2, 1.35)
    shape.quadraticCurveTo(3.4, 1.1, 3.1, 0.35)
    shape.quadraticCurveTo(2.2, -0.25, 0, -0.3)
    shape.quadraticCurveTo(-1.8, -0.25, -2.4, 0.1)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 1.7, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.22, bevelSegments: 2,
    })
    geo.translate(0, 0, -0.85)
    return geo
  }, [])

  return (
    <group>
      {/* Curved hull */}
      <mesh geometry={hullGeo} castShadow>
        <meshStandardMaterial color={WOOD} roughness={0.85} />
      </mesh>
      {/* Hull stripe */}
      <mesh position={[0.2, 1.0, 0]}>
        <boxGeometry args={[5.2, 0.18, 2.2]} />
        <meshStandardMaterial color={WOOD_LIGHT} roughness={0.8} />
      </mesh>
      {/* Deck */}
      <mesh position={[0.2, 1.38, 0]}>
        <boxGeometry args={[4.6, 0.1, 1.6]} />
        <meshStandardMaterial color={WOOD_LIGHT} roughness={0.9} />
      </mesh>
      {/* Stern castle */}
      <mesh position={[-1.8, 1.85, 0]} castShadow>
        <boxGeometry args={[1.3, 0.9, 1.7]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.85} />
      </mesh>
      {/* Bowsprit */}
      <mesh position={[3.6, 1.7, 0]} rotation={[0, 0, -0.35]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 2.0, 6]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={1} />
      </mesh>

      {/* Main mast */}
      <mesh position={[0.3, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 4.2, 8]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={1} />
      </mesh>
      {/* Fore mast */}
      <mesh position={[1.9, 2.7, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 3.0, 8]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={1} />
      </mesh>

      {/* Main sail — billowed */}
      <mesh position={[0.3, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <sphereGeometry args={[1.5, 12, 8, 0, Math.PI * 0.65, Math.PI * 0.25, Math.PI * 0.55]} />
        <meshStandardMaterial color={SAIL} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* Fore sail */}
      <mesh position={[1.9, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <sphereGeometry args={[1.0, 10, 7, 0, Math.PI * 0.6, Math.PI * 0.28, Math.PI * 0.5]} />
        <meshStandardMaterial color={SAIL} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* Jib sail on bowsprit */}
      <mesh position={[3.2, 2.3, 0]}>
        <coneGeometry args={[0.7, 1.6, 3, 1, true]} />
        <meshStandardMaterial color={SAIL} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Rigging lines */}
      {[[0.3, 5.2, 3.4, 1.55], [0.3, 5.2, -1.6, 1.55], [1.9, 4.1, 3.6, 1.6]].map(([mx, my, tx, ty], i) => {
        const from = new THREE.Vector3(mx, my, 0)
        const to = new THREE.Vector3(tx, ty, 0)
        const mid = from.clone().lerp(to, 0.5)
        const len = from.distanceTo(to)
        const angle = Math.atan2(to.y - from.y, to.x - from.x)
        return (
          <mesh key={i} position={mid} rotation={[0, 0, angle + Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, len, 4]} />
            <meshStandardMaterial color="#2A1A0C" roughness={1} />
          </mesh>
        )
      })}

      {/* Jolly Roger flag */}
      <mesh position={[0.75, 5.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.95, 0.6]} />
        <meshStandardMaterial color="#141414" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.76, 5.6, 0.01]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.15, 10]} />
        <meshBasicMaterial color="#F0B429" side={THREE.DoubleSide} />
      </mesh>

      {/* Figurehead */}
      <mesh position={[3.35, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial color="#E8D0A0" roughness={0.9} />
      </mesh>

      {/* Stern lantern */}
      <pointLight position={[-2.5, 2.4, 0]} color="#FFB84D" intensity={5} distance={9} />
      <mesh position={[-2.5, 2.4, 0]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshBasicMaterial color="#FFD98A" />
      </mesh>
    </group>
  )
}

/*
  PirateShip handles:
  1. Free sailing with WASD / arrow keys (blocked from beaching on land)
  2. Auto-voyage along a CatmullRom curve through the saga route
  3. Riding the shared wave function — the exact surface the water shader displaces
*/
const PirateShip = ({
  waypoints,
  voyage,
  onVoyageProgress,
  onVoyageEnd,
  followRef,
  shipStateRef,
}) => {
  const shipRef = useRef(null)
  const foamRef = useRef(null)
  const keys = useRef({})
  const velocity = useRef(0)
  const heading = useRef(Math.PI)
  const voyageT = useRef(0)
  const lastWp = useRef(-1)

  const curve = useMemo(() => {
    if (!waypoints || waypoints.length < 2) return null
    const pts = waypoints.map(([x, , z]) => new THREE.Vector3(x, 0, z))
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5)
  }, [waypoints])

  useEffect(() => {
    if (voyage) {
      voyageT.current = 0
      lastWp.current = -1
    }
  }, [voyage, curve])

  useEffect(() => {
    const down = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault()
      keys.current[e.key.toLowerCase()] = true
    }
    const up = (e) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  // Start just offshore of the first waypoint
  useEffect(() => {
    if (shipRef.current && waypoints?.length) {
      const [x, , z] = waypoints[0]
      const [sx, sz] = seekWater(x, z, 0, 1)
      shipRef.current.position.set(sx, 0, sz)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(({ clock }, dt) => {
    const ship = shipRef.current
    if (!ship) return
    const t = clock.elapsedTime
    const k = keys.current

    if (voyage && curve) {
      // ── Auto-voyage: ~2.2s per island leg ──
      const duration = Math.max(10, (waypoints.length - 1) * 2.2)
      voyageT.current = Math.min(1, voyageT.current + dt / duration)
      const u = voyageT.current
      const pos = curve.getPointAt(u)
      const tan = curve.getTangentAt(Math.min(u + 0.001, 1))
      ship.position.x = pos.x
      ship.position.z = pos.z
      heading.current = Math.atan2(-tan.z, tan.x)

      const idx = Math.floor(u * (waypoints.length - 1) + 0.0001)
      if (idx !== lastWp.current) {
        lastWp.current = idx
        onVoyageProgress?.(idx)
      }
      if (u >= 1) onVoyageEnd?.()
    } else {
      // ── Free sailing ──
      const fwd = k['w'] || k['arrowup']
      const back = k['s'] || k['arrowdown']
      const left = k['a'] || k['arrowleft']
      const right = k['d'] || k['arrowright']

      const MAX_SPD = 16
      if (fwd) velocity.current = Math.min(MAX_SPD, velocity.current + 14 * dt)
      else if (back) velocity.current = Math.max(-5, velocity.current - 10 * dt)
      else velocity.current *= Math.pow(0.35, dt)

      const turnRate = 1.4 * Math.min(1, Math.abs(velocity.current) / 4 + 0.35)
      if (left) heading.current += turnRate * dt
      if (right) heading.current -= turnRate * dt

      const nx = ship.position.x + Math.cos(heading.current) * velocity.current * dt
      const nz = ship.position.z + -Math.sin(heading.current) * velocity.current * dt

      // can't beach — stop at the shallows
      if (terrainHeight(nx, nz) > -0.6) {
        velocity.current = 0
      } else {
        const mX = WORLD_W / 2 - 6
        const mZ = WORLD_H / 2 - 6
        ship.position.x = THREE.MathUtils.clamp(nx, -mX, mX)
        ship.position.z = THREE.MathUtils.clamp(nz, -mZ, mZ)
      }
    }

    // ── Ride the waves ──
    const { x, z } = ship.position
    const h = waveHeight(x, z, t)
    const hx = waveHeight(x + 1.5, z, t)
    const hz = waveHeight(x, z + 1.5, t)
    // during voyage, clamp above any land the curve cuts across
    const floorY = voyage ? terrainHeight(x, z) + 0.45 : -Infinity
    ship.position.y = Math.max(h + 0.15, floorY)
    ship.rotation.y = heading.current
    const pitch = Math.atan2(hx - h, 1.5) * 0.6
    const roll = Math.atan2(hz - h, 1.5) * 0.6
    ship.rotation.z = pitch * Math.cos(heading.current) + roll * Math.sin(heading.current)
    ship.rotation.x = roll * Math.cos(heading.current) - pitch * Math.sin(heading.current)

    // Foam wake scales with speed
    if (foamRef.current) {
      const spd = voyage ? 10 : Math.abs(velocity.current)
      const s = THREE.MathUtils.clamp(spd / 10, 0.001, 1.6)
      foamRef.current.scale.set(s, 1, s * 0.7)
      foamRef.current.material.opacity = 0.35 * Math.min(1, s)
      foamRef.current.position.set(x - Math.cos(heading.current) * 3.4, 0.18, z + Math.sin(heading.current) * 3.4)
      foamRef.current.rotation.y = heading.current
    }

    if (followRef) followRef.current = { x, y: ship.position.y, z }
    if (shipStateRef) shipStateRef.current = { x, z }
  })

  return (
    <>
      <group ref={shipRef}>
        <ShipModel />
      </group>
      <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <circleGeometry args={[2.6, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </>
  )
}

export default PirateShip
