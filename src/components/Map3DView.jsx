import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import Ocean, { RedLineWalls } from './three/Ocean'
import Island from './three/Island'
import PirateShip from './three/PirateShip'
import JourneyRoute from './three/JourneyRoute'
import CameraRig from './three/CameraRig'
import SeaLabels from './three/SeaLabels'
import { locTo3D } from '../constants/world3d'

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

  const waypoints = useMemo(
    () => sortedRoute.map((loc) => locTo3D(loc)),
    [sortedRoute],
  )

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

  const handleFlyTo = ([x, y, z], size) => {
    if (voyage) return
    followingRef.current = false
    const isSky = y > 1
    focusGoalRef.current = {
      target: [x, y + size, z],
      camPos: [x + size * 4 + 8, y + size * 3 + (isSky ? 4 : 10), z + size * 4 + 8],
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [0, 120, 160], fov: 50, near: 0.5, far: 1200 }}
        onPointerMissed={onClosePin}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Sky & atmosphere */}
          <Sky
            distance={800}
            sunPosition={[120, 60, -80]}
            turbidity={6}
            rayleigh={0.6}
            mieCoefficient={0.02}
            mieDirectionalG={0.85}
          />
          <Stars radius={500} depth={60} count={1200} factor={4} fade speed={0.4} />
          <fog attach="fog" args={['#8FCADB', 220, 620]} />

          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[120, 140, -60]}
            intensity={1.6}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-220}
            shadow-camera-right={220}
            shadow-camera-top={140}
            shadow-camera-bottom={-140}
          />
          <hemisphereLight args={['#BFE8F5', '#1A6E85', 0.5]} />

          {/* World */}
          <Ocean />
          <RedLineWalls />
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
            minDistance={10}
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
        fontSize: 11, color: 'rgba(245,235,216,0.75)', fontFamily: 'Cinzel, serif',
        letterSpacing: '1px', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 20,
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}>
        ⛵ WASD / arrows to sail · Drag to orbit · Scroll to zoom · Click an island to explore
      </div>
    </div>
  )
}

export default Map3DView
