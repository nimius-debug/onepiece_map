import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import Terrain, { MaryGeoise } from './three/Terrain'
import Water from './three/Water'
import Island from './three/Island'
import PirateShip from './three/PirateShip'
import JourneyRoute from './three/JourneyRoute'
import CameraRig from './three/CameraRig'
import SeaLabels from './three/SeaLabels'
import Vegetation from './three/Vegetation'
import CloudsLayer from './three/CloudsLayer'
import { SKY_ISLANDS, SUN_POSITION } from '../constants/world3d'
import { locAnchor, seekWater } from '../terrain/heightfield'

const overlayBtn = {
  padding: '10px 18px',
  background: 'rgba(10,21,53,0.88)',
  border: '1px solid rgba(240,180,41,0.5)',
  borderRadius: 10,
  color: '#F0B429',
  fontFamily: 'Cinzel, serif',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '1px',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
  userSelect: 'none',
}

const Map3DView = ({
  allLocations,
  visibleLocations,
  activeSaga,
  visibleLocation,
  onHover,
  onLeave,
  onClick,
  onClosePin,
}) => {
  const controlsRef = useRef(null)
  const focusGoalRef = useRef(null)
  const followingRef = useRef(false)
  const followRef = useRef(null)
  const shipStateRef = useRef(null)

  const [voyage, setVoyage] = useState(false)
  const [approaching, setApproaching] = useState(null)

  const sortedRoute = useMemo(
    () => [...visibleLocations].sort((a, b) => a.order - b.order),
    [visibleLocations],
  )

  // The ship sails harbor-to-harbor: each waypoint is pushed from the
  // island's center out to its coast, toward the neighboring stop
  const waypoints = useMemo(() => {
    const anchors = sortedRoute.map((loc) => locAnchor(loc))
    return anchors.map(([x, , z], i) => {
      const [nx, , nz] = anchors[i + 1] ?? anchors[i - 1] ?? [x + 1, 0, z]
      const toward = anchors[i + 1] ? [nx - x, nz - z] : [x - nx, z - nz]
      const [hx, hz] = seekWater(x, z, toward[0], toward[1])
      return [hx, 0, hz]
    })
  }, [sortedRoute])

  const startVoyage = () => {
    setVoyage(true)
    followingRef.current = true
    focusGoalRef.current = null
    onClosePin()
  }

  const endVoyage = () => {
    setVoyage(false)
    followingRef.current = false
    setApproaching(null)
  }

  const handleFlyTo = ([x, y, z], location) => {
    if (voyage) return
    followingRef.current = false
    const isSky = SKY_ISLANDS.has(location.id)
    focusGoalRef.current = {
      target: [x, y + 3, z],
      camPos: [x + 22, y + (isSky ? 8 : 16), z + 22],
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Canvas
        shadows="soft"
        camera={{ position: [0, 130, 170], fov: 50, near: 0.5, far: 1500 }}
        gl={{ toneMappingExposure: 1.15 }}
        onPointerMissed={onClosePin}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Sky & atmosphere — warm mid-afternoon */}
          <Sky
            distance={4000}
            sunPosition={SUN_POSITION}
            turbidity={7}
            rayleigh={1.4}
            mieCoefficient={0.004}
            mieDirectionalG={0.94}
          />
          <fog attach="fog" args={['#BCD6E2', 300, 950]} />

          {/* Lighting — directional must track SUN_POSITION (water specular
              and the Sky's sun disk both depend on it) */}
          <ambientLight intensity={0.25} />
          <directionalLight
            color="#FFE7C4"
            intensity={2.4}
            position={SUN_POSITION.map((v) => v * 1.5)}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-210}
            shadow-camera-right={210}
            shadow-camera-top={120}
            shadow-camera-bottom={-120}
            shadow-camera-far={800}
            shadow-bias={-0.0004}
            shadow-normalBias={2}
          />
          <hemisphereLight args={['#BFD9EA', '#3E5C46', 0.6]} />

          {/* World */}
          <Terrain />
          <Water />
          <MaryGeoise />
          <Vegetation />
          <CloudsLayer />
          <SeaLabels />
          <JourneyRoute waypoints={waypoints} activeSaga={activeSaga} />

          {allLocations.map((loc) => (
            <Island
              key={loc.id}
              location={loc}
              isActive={visibleLocation?.id === loc.id}
              isDimmed={activeSaga ? loc.saga !== activeSaga : false}
              onHover={onHover}
              onLeave={onLeave}
              onClick={onClick}
              onFlyTo={handleFlyTo}
            />
          ))}

          <PirateShip
            waypoints={waypoints}
            voyage={voyage}
            onVoyageProgress={(idx) => setApproaching(sortedRoute[idx]?.name ?? null)}
            onVoyageEnd={endVoyage}
            followRef={followRef}
            shipStateRef={shipStateRef}
          />

          {/* Camera behaviors */}
          <CameraRig
            controlsRef={controlsRef}
            focusGoalRef={focusGoalRef}
            followingRef={followingRef}
            followRef={followRef}
          />
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.08}
            minDistance={8}
            maxDistance={420}
            maxPolarAngle={Math.PI / 2.15}
            onStart={() => { focusGoalRef.current = null }}
          />
        </Suspense>
      </Canvas>

      {/* ── Game overlay UI ── */}
      <div style={{
        position: 'absolute', top: 14, right: 16, display: 'flex', gap: 8, zIndex: 30,
      }}>
        {!voyage ? (
          <button
            style={overlayBtn}
            onClick={startVoyage}
            disabled={waypoints.length < 2}
            title="Auto-sail the route with a chase camera"
          >
            ⛵ SET SAIL{activeSaga ? ` — ${activeSaga.toUpperCase()}` : ''}
          </button>
        ) : (
          <button style={{ ...overlayBtn, borderColor: 'rgba(231,76,60,0.6)', color: '#E74C3C' }} onClick={endVoyage}>
            ✕ END VOYAGE
          </button>
        )}
      </div>

      {/* Voyage banner */}
      {voyage && approaching && (
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 26px', background: 'rgba(10,21,53,0.88)',
          border: '1px solid rgba(240,180,41,0.5)', borderRadius: 10,
          color: '#F5EBD8', fontFamily: 'Cinzel, serif', fontSize: 14,
          letterSpacing: '1px', zIndex: 30, backdropFilter: 'blur(8px)',
          whiteSpace: 'nowrap',
        }}>
          ⚓ Now approaching: <span style={{ color: '#F0B429', fontWeight: 700 }}>{approaching}</span>
        </div>
      )}

      {/* Controls hint */}
      <div style={{
        position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
        fontSize: 11, color: 'rgba(245,235,216,0.85)', fontFamily: 'Cinzel, serif',
        letterSpacing: '1px', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 20,
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}>
        ⛵ WASD / arrows to sail · Drag to orbit · Scroll to zoom · Click an island to explore
      </div>
    </div>
  )
}

export default Map3DView
