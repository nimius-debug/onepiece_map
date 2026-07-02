import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_W, WORLD_H, CALM_N_Z, CALM_S_Z } from '../../constants/world3d'

// Same wave formula as the ocean vertex shader, so the ship rides the water
const waveHeight = (x, z, t) => {
  let h =
    Math.sin(x * 0.12 + t * 0.9) * 0.55 +
    Math.sin(z * 0.17 + t * 1.15) * 0.45 +
    Math.sin((x + z) * 0.07 + t * 0.6) * 0.65
  if (z > CALM_N_Z && z < CALM_S_Z) h *= 0.15
  return h
}

const WOOD = '#6B4226'
const WOOD_DARK = '#4A2C16'
const SAIL = '#F5EBD8'

const ShipModel = () => (
  <group>
    {/* Hull */}
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[4.4, 1.1, 1.8]} />
      <meshStandardMaterial color={WOOD} roughness={0.9} flatShading />
    </mesh>
    {/* Bow (front wedge) */}
    <mesh position={[2.6, 0.5, 0]} rotation={[0, 0, -0.2]} castShadow>
      <coneGeometry args={[0.9, 1.6, 4]} />
      <meshStandardMaterial color={WOOD} roughness={0.9} flatShading />
    </mesh>
    {/* Stern castle */}
    <mesh position={[-1.7, 1.35, 0]} castShadow>
      <boxGeometry args={[1.2, 0.8, 1.6]} />
      <meshStandardMaterial color={WOOD_DARK} roughness={0.9} flatShading />
    </mesh>
    {/* Deck rail */}
    <mesh position={[0.4, 1.12, 0]}>
      <boxGeometry args={[3.4, 0.14, 1.9]} />
      <meshStandardMaterial color={WOOD_DARK} roughness={0.9} flatShading />
    </mesh>
    {/* Main mast */}
    <mesh position={[0.3, 2.6, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.13, 3.6, 6]} />
      <meshStandardMaterial color={WOOD_DARK} roughness={1} flatShading />
    </mesh>
    {/* Main sail — slightly curved plane */}
    <mesh position={[0.3, 2.9, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
      <planeGeometry args={[2.4, 1.9, 6, 1]} />
      <meshStandardMaterial color={SAIL} roughness={0.85} side={THREE.DoubleSide} flatShading />
    </mesh>
    {/* Fore sail */}
    <mesh position={[1.7, 2.0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
      <planeGeometry args={[1.4, 1.1]} />
      <meshStandardMaterial color={SAIL} roughness={0.85} side={THREE.DoubleSide} flatShading />
    </mesh>
    {/* Jolly Roger flag */}
    <mesh position={[0.75, 4.35, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[0.9, 0.55]} />
      <meshStandardMaterial color="#141414" roughness={1} side={THREE.DoubleSide} />
    </mesh>
    {/* Straw-hat gold band dot on the flag */}
    <mesh position={[0.76, 4.35, 0.01]} rotation={[0, Math.PI / 2, 0]}>
      <circleGeometry args={[0.14, 10]} />
      <meshBasicMaterial color="#F0B429" side={THREE.DoubleSide} />
    </mesh>
    {/* Figurehead — a nod to the Going Merry */}
    <mesh position={[3.3, 1.15, 0]} castShadow>
      <sphereGeometry args={[0.34, 8, 6]} />
      <meshStandardMaterial color="#E8D0A0" roughness={0.9} flatShading />
    </mesh>
    {/* Stern lantern glow */}
    <pointLight position={[-2.4, 1.8, 0]} color="#FFB84D" intensity={6} distance={9} />
    <mesh position={[-2.4, 1.8, 0]}>
      <sphereGeometry args={[0.16, 8, 6]} />
      <meshBasicMaterial color="#FFD98A" />
    </mesh>
  </group>
)

/*
  PirateShip handles three things:
  1. Free sailing with WASD / arrow keys (always available outside a voyage)
  2. Auto-voyage: follows a CatmullRom curve through the saga route
  3. Riding the waves — position + pitch/roll follow the water surface
*/
const PirateShip = ({
  waypoints,          // [[x,y,z], ...] ordered route for voyage mode
  voyage,             // true while auto-sailing
  onVoyageProgress,   // (index) → called when passing each waypoint
  onVoyageEnd,
  followRef,          // ref written with ship world position each frame (camera follow)
  shipStateRef,       // exposes { position } so the overlay can read it
}) => {
  const shipRef = useRef(null)
  const foamRef = useRef(null)
  const keys = useRef({})
  const velocity = useRef(0)
  const heading = useRef(Math.PI) // face west→east start
  const voyageT = useRef(0)
  const lastWp = useRef(-1)

  const curve = useMemo(() => {
    if (!waypoints || waypoints.length < 2) return null
    const pts = waypoints.map(([x, , z]) => new THREE.Vector3(x, 0, z))
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5)
  }, [waypoints])

  // Reset voyage progress when a new voyage starts
  useEffect(() => {
    if (voyage) {
      voyageT.current = 0
      lastWp.current = -1
    }
  }, [voyage, curve])

  // Keyboard controls
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

  // Place ship at first waypoint on mount
  useEffect(() => {
    if (shipRef.current && waypoints?.length) {
      const [x, , z] = waypoints[0]
      shipRef.current.position.set(x, 0, z)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(({ clock }, dt) => {
    const ship = shipRef.current
    if (!ship) return
    const t = clock.elapsedTime
    const k = keys.current

    if (voyage && curve) {
      // ── Auto-voyage along the route: ~2.2s per island leg ──
      const duration = Math.max(10, (waypoints.length - 1) * 2.2)
      voyageT.current = Math.min(1, voyageT.current + dt / duration)
      const u = voyageT.current
      const pos = curve.getPointAt(u)
      const tan = curve.getTangentAt(Math.min(u + 0.001, 1))
      ship.position.x = pos.x
      ship.position.z = pos.z
      heading.current = Math.atan2(-tan.z, tan.x)

      // Waypoint progress callbacks
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
      else velocity.current *= Math.pow(0.35, dt) // water drag

      const turnRate = 1.4 * Math.min(1, Math.abs(velocity.current) / 4 + 0.35)
      if (left) heading.current += turnRate * dt
      if (right) heading.current -= turnRate * dt

      ship.position.x += Math.cos(heading.current) * velocity.current * dt
      ship.position.z += -Math.sin(heading.current) * velocity.current * dt

      // Keep inside the world
      const mX = WORLD_W / 2 - 6
      const mZ = WORLD_H / 2 - 6
      ship.position.x = THREE.MathUtils.clamp(ship.position.x, -mX, mX)
      ship.position.z = THREE.MathUtils.clamp(ship.position.z, -mZ, mZ)
    }

    // ── Ride the waves: height + pitch/roll from water surface ──
    const { x, z } = ship.position
    const h = waveHeight(x, z, t)
    const hx = waveHeight(x + 1.5, z, t)
    const hz = waveHeight(x, z + 1.5, t)
    ship.position.y = h + 0.25
    ship.rotation.y = heading.current
    // pitch/roll toward the wave slope, in ship-local terms (approximation)
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
      foamRef.current.position.set(x - Math.cos(heading.current) * 3, 0.15, z + Math.sin(heading.current) * 3)
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
      {/* Foam wake */}
      <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </>
  )
}

export default PirateShip
