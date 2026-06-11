import locationsData from './data/locations.json'
import MapView from './components/MapView'
import TooltipCard from './components/TooltipCard'
import SagaFilterPanel from './components/SagaFilterPanel'
import SagaPills from './components/SagaPills'
import Header from './components/Header'
import { useMapState } from './hooks/useMapState'

const ALL_LOCATIONS = locationsData.locations

const App = () => {
  const {
    activeSaga, setActiveSaga,
    hoveredLocation, pinnedLocation, visibleLocation,
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

        <MapView
          allLocations={ALL_LOCATIONS}
          visibleLocations={visibleLocations}
          activeSaga={activeSaga}
          visibleLocation={visibleLocation}
          onHover={onHover}
          onLeave={onLeave}
          onClick={onClick}
          onClosePin={onClosePin}
        />
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
