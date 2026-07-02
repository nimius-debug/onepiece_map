import { lazy, Suspense, useState } from 'react'
import locationsData from './data/locations.json'
import MapView from './components/MapView'

const Map3DView = lazy(() => import('./components/Map3DView'))
import TooltipCard from './components/TooltipCard'
import SagaFilterPanel from './components/SagaFilterPanel'
import SagaPills from './components/SagaPills'
import Header from './components/Header'
import { useMapState } from './hooks/useMapState'

const ALL_LOCATIONS = locationsData.locations

const App = () => {
  const [mode3D, setMode3D] = useState(true)
  const {
    activeSaga, setActiveSaga,
    pinnedLocation, visibleLocation,
    tooltipPos,
    onHover, onLeave, onClick, onClosePin,
  } = useMapState()

  const visibleLocations = activeSaga
    ? ALL_LOCATIONS.filter((l) => l.saga === activeSaga)
    : ALL_LOCATIONS

  const locationCounts = ALL_LOCATIONS.reduce((acc, loc) => {
    acc[loc.saga] = (acc[loc.saga] ?? 0) + 1
    return acc
  }, {})

  const MapComponent = mode3D ? Map3DView : MapView

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-void)' }}>
      <Header
        activeSaga={activeSaga}
        activeLocation={visibleLocation}
        totalCount={ALL_LOCATIONS.length}
      />

      <div className="app-body">
        <SagaFilterPanel
          activeSaga={activeSaga}
          setActiveSaga={setActiveSaga}
          locationCounts={locationCounts}
          totalCount={ALL_LOCATIONS.length}
        />
        <SagaPills
          activeSaga={activeSaga}
          setActiveSaga={setActiveSaga}
          locationCounts={locationCounts}
          totalCount={ALL_LOCATIONS.length}
        />

        <div style={{ position: 'relative', flex: 1, minWidth: 0, minHeight: 0 }}>
          <Suspense
            fallback={
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', height: '100%', color: '#F0B429',
                fontFamily: 'Cinzel, serif', letterSpacing: '2px', fontSize: 14,
              }}>
                ⛵ Charting the Grand Line…
              </div>
            }
          >
            <MapComponent
              allLocations={ALL_LOCATIONS}
              visibleLocations={visibleLocations}
              activeSaga={activeSaga}
              visibleLocation={visibleLocation}
              onHover={onHover}
              onLeave={onLeave}
              onClick={onClick}
              onClosePin={onClosePin}
            />
          </Suspense>

          {/* 2D / 3D mode toggle */}
          <button
            onClick={() => { setMode3D((v) => !v); onClosePin() }}
            style={{
              position: 'absolute', top: 14, left: 16, zIndex: 40,
              padding: '9px 16px',
              background: 'rgba(10,21,53,0.88)',
              border: '1px solid rgba(240,180,41,0.5)',
              borderRadius: 10,
              color: '#F0B429',
              fontFamily: 'Cinzel, serif',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '1px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
            title="Switch between the 3D voyage and the 2D chart"
          >
            {mode3D ? '🗺 2D CHART' : '🌊 3D VOYAGE'}
          </button>
        </div>
      </div>

      {/* Tooltip rendered outside map so it's immune to pan/zoom transform */}
      {visibleLocation && (
        <TooltipCard
          location={visibleLocation}
          isPinned={!!pinnedLocation}
          onClose={onClosePin}
          tooltipPos={tooltipPos}
        />
      )}
    </div>
  )
}

export default App
