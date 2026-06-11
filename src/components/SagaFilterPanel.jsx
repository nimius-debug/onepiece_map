import { SAGAS, SAGA_ORDER } from '../constants/sagas'

const SagaFilterPanel = ({ activeSaga, setActiveSaga, locationCounts, totalCount }) => {
  return (
    <aside className="sidebar">
      {/* Title */}
      <div style={{
        padding: '20px 16px 14px',
        borderBottom: '1px solid var(--border-dim)',
      }}>
        <div style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.5px',
          lineHeight: 1.3,
          marginBottom: 4,
        }}>
          One Piece
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}>
          Luffy's Grand Voyage
        </div>
        <div style={{
          marginTop: 10,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}>
          {totalCount} locations across the seas
        </div>
      </div>

      {/* All button */}
      <div style={{ padding: '12px 12px 6px' }}>
        <button
          onClick={() => setActiveSaga(null)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${!activeSaga ? 'rgba(240,180,41,0.6)' : 'var(--border-dim)'}`,
            background: !activeSaga ? 'rgba(240,180,41,0.12)' : 'transparent',
            color: !activeSaga ? 'var(--gold)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Cinzel, serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease',
          }}
        >
          <span>⚓ All Locations</span>
          <span style={{
            background: !activeSaga ? 'rgba(240,180,41,0.25)' : 'rgba(158,179,216,0.1)',
            padding: '2px 7px',
            borderRadius: 99,
            fontSize: 10,
          }}>
            {totalCount}
          </span>
        </button>
      </div>

      {/* Saga list */}
      <div style={{ padding: '0 12px 16px', flex: 1 }}>
        <div style={{
          fontSize: 9,
          color: 'var(--text-muted)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontFamily: 'Cinzel, serif',
          padding: '8px 0 6px',
          opacity: 0.7,
        }}>
          Filter by Saga
        </div>
        {SAGA_ORDER.map((sagaName) => {
          const saga = SAGAS[sagaName]
          const isActive = activeSaga === sagaName
          const count = locationCounts[sagaName] ?? 0

          return (
            <button
              key={sagaName}
              onClick={() => setActiveSaga(isActive ? null : sagaName)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: `1px solid ${isActive ? saga.color + '70' : 'transparent'}`,
                background: isActive ? saga.color + '18' : 'transparent',
                color: isActive ? saga.color : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 3,
                textAlign: 'left',
                transition: 'all 0.2s ease',
                borderLeft: `3px solid ${isActive ? saga.color : 'transparent'}`,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = saga.color + '0e'
                  e.currentTarget.style.color = saga.color + 'cc'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>{saga.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {sagaName}
                </div>
                <div style={{
                  fontSize: 10,
                  opacity: 0.65,
                  lineHeight: 1.4,
                  marginTop: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontStyle: 'italic',
                }}>
                  {saga.description}
                </div>
              </div>
              <span style={{
                fontSize: 10,
                background: isActive ? saga.color + '30' : 'rgba(158,179,216,0.08)',
                color: isActive ? saga.color : 'var(--text-muted)',
                padding: '2px 6px',
                borderRadius: 99,
                flexShrink: 0,
                fontFamily: 'Inter, sans-serif',
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Footer legend */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-dim)',
        fontSize: 10,
        color: 'var(--text-muted)',
        lineHeight: 1.7,
        opacity: 0.7,
      }}>
        <div style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.5px', marginBottom: 4, color: 'var(--gold)', opacity: 0.7 }}>
          How to use
        </div>
        <div>Hover a marker to preview</div>
        <div>Click a marker for full details</div>
        <div>Click a saga to filter the map</div>
      </div>
    </aside>
  )
}

export default SagaFilterPanel
