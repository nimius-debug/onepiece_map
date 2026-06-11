import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { MAP_W, MAP_H } from '../constants/mapConfig'
import WorldMapSVG from './WorldMapSVG'
import JourneyPath from './JourneyPath'
import LocationMarker from './LocationMarker'
import ZoomControls from './ZoomControls'

const MapView = ({
  allLocations,
  visibleLocations,
  activeSaga,
  visibleLocation,
  onHover,
  onLeave,
  onClick,
  onClosePin,
}) => (
  <div
    style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    onClick={onClosePin}
  >
    <TransformWrapper
      initialScale={0.45}
      minScale={0.18}
      maxScale={4}
      centerOnInit
      smooth
      wheel={{ step: 0.08 }}
      pinch={{ step: 5 }}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: `${MAP_W}px`, height: `${MAP_H}px`, position: 'relative' }}
          >
            <WorldMapSVG />

            <JourneyPath
              locations={visibleLocations}
              activeSaga={activeSaga}
            />

            {allLocations.map((loc) => {
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

            {/* Skypiea sky indicator */}
            <div style={{
              position: 'absolute',
              top: '8%',
              left: '44%',
              fontSize: 13,
              fontFamily: 'Cinzel, serif',
              color: 'rgba(206,147,216,0.48)',
              letterSpacing: '2px',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              ☁ SKY ISLAND
            </div>
          </TransformComponent>

          <ZoomControls
            onZoomIn={() => zoomIn()}
            onZoomOut={() => zoomOut()}
            onReset={() => resetTransform()}
          />
        </>
      )}
    </TransformWrapper>

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
      zIndex: 20,
    }}>
      ✦ Scroll to zoom · Drag to pan · Click a marker to explore ✦
    </div>
  </div>
)

export default MapView
