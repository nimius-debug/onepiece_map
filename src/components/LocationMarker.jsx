import { SAGAS } from '../constants/sagas'

const LocationMarker = ({ location, isActive, isDimmed, onHover, onLeave, onClick }) => {
  const saga  = SAGAS[location.saga]
  const color = saga?.color ?? '#F0B429'
  const isSky = location.id === 'skypiea'

  return (
    <div
      style={{
        position: 'absolute',
        left: `${location.x}%`,
        top:  `${location.y}%`,
        animationDelay: `${location.order * 60}ms`,
        animationFillMode: 'both',
      }}
      onMouseEnter={(e) => onHover(location, { x: e.clientX, y: e.clientY })}
      onMouseLeave={onLeave}
      onClick={(e) => { e.stopPropagation(); onClick(location, { x: e.clientX, y: e.clientY }) }}
      title={location.name}
    >
      {/* Pulse ring */}
      {!isDimmed && (
        <div
          className="marker-ring"
          style={{
            color,
            animationDelay: `${(location.order % 7) * 0.38}s`,
          }}
        />
      )}

      {/* Main dot */}
      <div
        className={`marker-dot ${isSky ? 'marker-sky' : ''} ${isActive ? 'active' : ''}`}
        style={{
          backgroundColor: color,
          boxShadow: isDimmed
            ? 'none'
            : isActive
            ? `0 0 0 2px ${color}, 0 0 14px ${color}88, 0 0 28px ${color}44`
            : `0 0 7px ${color}88`,
          opacity: isDimmed ? 0.18 : 1,
          transition: 'opacity 0.3s ease, box-shadow 0.25s ease, transform 0.2s ease',
          animationDelay: `${location.order * 60}ms`,
        }}
      />

      {/* Order badge when active */}
      {isActive && !isDimmed && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '-24px',
          transform: 'translateX(-50%)',
          background: color,
          color: '#050A1E',
          fontSize: '9px',
          fontFamily: 'Cinzel, serif',
          fontWeight: '700',
          padding: '2px 6px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 30,
        }}>
          #{location.order}
        </div>
      )}
    </div>
  )
}

export default LocationMarker
