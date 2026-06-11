import { useRef, useState, useEffect, useCallback } from 'react'
import locationsData from './data/locations.json'
import WorldMapSVG from './components/WorldMapSVG'
import LocationMarker from './components/LocationMarker'
import TooltipCard from './components/TooltipCard'
import SagaFilterPanel from './components/SagaFilterPanel'
import JourneyPath from './components/JourneyPath'
import Header from './components/Header'
import { useMapState } from './hooks/useMapState'

const ALL_LOCATIONS = locationsData.locations

const App = () => {
  const containerRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const {
    activeSaga, setActiveSaga,
    hoveredLocation, pinnedLocation, visibleLocation,
    onHover, onLeave, onClick, onClosePin,
  } = useMapState()

  // Track container dimensions for path and tooltip positioning
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Filter locations by active saga
  const visibleLocations = activeSaga
    ? ALL_LOCATIONS.filter((l) => l.saga === activeSaga)
    : ALL_LOCATIONS

  // Count per saga
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

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SagaFilterPanel
          activeSaga={activeSaga}
          setActiveSaga={setActiveSaga}
          locationCounts={locationCounts}
          totalCount={ALL_LOCATIONS.length}
        />

        {/* Map area */}
        <div
          ref={containerRef}
          className="map-wrapper"
          style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
          onClick={(e) => {
            // Click on empty map — deselect pinned
            if (e.target === containerRef.current || e.target.tagName === 'svg') {
              onClosePin()
            }
          }}
        >
          {/* SVG world map background */}
          <WorldMapSVG />

          {/* Journey path overlay */}
          {containerSize.width > 0 && (
            <JourneyPath
              locations={visibleLocations}
              activeSaga={activeSaga}
              containerSize={containerSize}
            />
          )}

          {/* Location markers */}
          {ALL_LOCATIONS.map((loc) => {
            const isDimmed = activeSaga ? loc.saga !== activeSaga : false
            const isActive = visibleLocation?.id === loc.id
            return (
              <LocationMarker
                key={loc.id}
                location={loc}
                isActive={isActive}
                isDimmed={isDimmed}
                onHover={onHover}
                onLeave={onLeave}
                onClick={onClick}
              />
            )
          })}

          {/* Tooltip / Info card */}
          {visibleLocation && (
            <TooltipCard
              location={visibleLocation}
              isPinned={!!pinnedLocation}
              onClose={onClosePin}
              containerRef={containerRef}
            />
          )}

          {/* Skypiea sky indicator */}
          <div style={{
            position: 'absolute',
            top: '8%',
            left: '37%',
            fontSize: 10,
            fontFamily: 'Cinzel, serif',
            color: 'rgba(206,147,216,0.5)',
            letterSpacing: '1.5px',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            ☁ SKY ISLAND
          </div>

          {/* Intro hint */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: 'var(--text-muted)',
            fontFamily: 'Cinzel, serif',
            letterSpacing: '1px',
            opacity: 0.5,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            ✦ Hover a marker to explore · Click to pin ✦
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
