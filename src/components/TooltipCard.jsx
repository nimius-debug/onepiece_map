import { useLayoutEffect, useRef, useState } from 'react'
import { SAGAS } from '../constants/sagas'

const CARD_W = 290
const CARD_H_ESTIMATE = 200

const TooltipCard = ({ location, isPinned, onClose, containerRef }) => {
  const cardRef = useRef(null)
  const [position, setPosition] = useState({ left: -9999, top: -9999 })

  const saga = SAGAS[location.saga]
  const color = saga?.color ?? '#F0B429'

  useLayoutEffect(() => {
    if (!containerRef?.current || !cardRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const cardH = cardRef.current.offsetHeight || CARD_H_ESTIMATE

    const markerX = (location.x / 100) * container.width
    const markerY = (location.y / 100) * container.height
    const gap = 20

    let left = markerX + gap
    let top = markerY - cardH / 2

    // Flip left if near right edge
    if (left + CARD_W > container.width - 10) {
      left = markerX - CARD_W - gap
    }
    // Clamp vertically
    if (top < 4) top = 4
    if (top + cardH > container.height - 4) {
      top = container.height - cardH - 4
    }

    setPosition({ left, top })
  }, [location, containerRef, isPinned])

  return (
    <div
      ref={cardRef}
      className={`tooltip-card ${isPinned ? 'pinned' : ''}`}
      style={{ left: position.left, top: position.top }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>{location.emoji}</span>
            <h3 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 15,
              fontWeight: 700,
              color: color,
              lineHeight: 1.2,
              letterSpacing: '0.3px',
            }}>
              {location.name}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span
              className="saga-badge"
              style={{ color, borderColor: color + '60', background: color + '18' }}
            >
              {location.saga}
            </span>
            <span
              className="saga-badge"
              style={{ color: 'var(--text-muted)', borderColor: 'rgba(158,179,216,0.3)', background: 'rgba(158,179,216,0.08)' }}
            >
              #{location.order} · {location.region}
            </span>
          </div>
        </div>

        {isPinned && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0 0 0 8px',
              fontSize: 16,
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* Arc */}
      <div style={{
        fontSize: 10,
        color: 'var(--text-muted)',
        fontFamily: 'Cinzel, serif',
        letterSpacing: '0.5px',
        marginBottom: 8,
        textTransform: 'uppercase',
      }}>
        {location.arc}
      </div>

      {/* Description */}
      <p style={{
        fontSize: 12,
        color: 'var(--text-primary)',
        lineHeight: 1.65,
        marginBottom: 10,
        opacity: 0.9,
      }}>
        {location.description}
      </p>

      {/* Key Events */}
      {isPinned && location.keyEvents?.length > 0 && (
        <div>
          <div style={{
            fontSize: 9,
            color: color,
            fontFamily: 'Cinzel, serif',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            ⚔ Key Events
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {location.keyEvents.map((evt, i) => (
              <li key={i} style={{
                fontSize: 11,
                color: 'var(--text-primary)',
                lineHeight: 1.55,
                padding: '3px 0 3px 12px',
                position: 'relative',
                borderLeft: `2px solid ${color}55`,
                paddingLeft: 10,
                marginBottom: 4,
                opacity: 0.88,
              }}>
                {evt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isPinned && (
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          marginTop: 6,
          fontStyle: 'italic',
        }}>
          Click to expand ›
        </div>
      )}

      {/* Decorative corner */}
      <div style={{
        position: 'absolute',
        top: 8, right: 8,
        width: 8, height: 8,
        borderTop: `1px solid ${color}50`,
        borderRight: `1px solid ${color}50`,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 8, left: 8,
        width: 8, height: 8,
        borderBottom: `1px solid ${color}50`,
        borderLeft: `1px solid ${color}50`,
      }} />
    </div>
  )
}

export default TooltipCard
