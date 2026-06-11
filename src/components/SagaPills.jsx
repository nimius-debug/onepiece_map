import { SAGAS, SAGA_ORDER } from '../constants/sagas'

// Mobile-only horizontal scrolling saga filter (replaces the sidebar)
const SagaPills = ({ activeSaga, setActiveSaga, locationCounts, totalCount }) => (
  <div className="saga-pills">
    <button
      className="saga-pill"
      onClick={() => setActiveSaga(null)}
      style={{
        border: `1px solid ${!activeSaga ? 'rgba(240,180,41,0.6)' : 'var(--border-dim)'}`,
        background: !activeSaga ? 'rgba(240,180,41,0.15)' : 'transparent',
        color: !activeSaga ? 'var(--gold)' : 'var(--text-muted)',
      }}
    >
      ⚓ All <span style={{ opacity: 0.7 }}>{totalCount}</span>
    </button>

    {SAGA_ORDER.map((sagaName) => {
      const saga = SAGAS[sagaName]
      const isActive = activeSaga === sagaName
      return (
        <button
          key={sagaName}
          className="saga-pill"
          onClick={() => setActiveSaga(isActive ? null : sagaName)}
          style={{
            border: `1px solid ${isActive ? saga.color : 'var(--border-dim)'}`,
            background: isActive ? saga.color + '22' : 'transparent',
            color: isActive ? saga.color : 'var(--text-muted)',
          }}
        >
          {saga.emoji} {sagaName}{' '}
          <span style={{ opacity: 0.7 }}>{locationCounts[sagaName] ?? 0}</span>
        </button>
      )
    })}
  </div>
)

export default SagaPills
