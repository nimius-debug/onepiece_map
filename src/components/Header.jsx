const Header = ({ activeSaga, activeLocation, totalCount }) => (
  <header style={{
    height: 52,
    flexShrink: 0,
    background: 'linear-gradient(90deg, rgba(5,10,30,0.98) 0%, rgba(10,21,53,0.98) 50%, rgba(5,10,30,0.98) 100%)',
    borderBottom: '1px solid var(--border-dim)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: 16,
    zIndex: 60,
    backdropFilter: 'blur(8px)',
  }}>
    {/* Logo / Title */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 20 }}>🏴‍☠️</span>
      <div>
        <div style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 13,
          fontWeight: 700,
          background: 'linear-gradient(90deg, #8A6510 0%, #F0B429 50%, #8A6510 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
          letterSpacing: '0.5px',
        }}>
          One Piece
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 8.5,
          color: 'var(--text-muted)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginTop: 1,
        }}>
          Luffy's Grand Voyage
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="hide-mobile" style={{ width: 1, height: 28, background: 'var(--border-dim)' }} />

    {/* Active saga indicator */}
    {activeSaga ? (
      <div className="hide-mobile" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: 'Cinzel, serif',
      }}>
        <span style={{ opacity: 0.6 }}>Viewing:</span>
        <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{activeSaga}</span>
      </div>
    ) : (
      <div className="hide-mobile" style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: 'Cinzel, serif',
        opacity: 0.7,
      }}>
        {totalCount} islands across the seas
      </div>
    )}

    {/* Active location breadcrumb */}
    {activeLocation && (
      <>
        <div className="hide-mobile" style={{ width: 1, height: 20, background: 'var(--border-dim)', opacity: 0.5 }} />
        <div className="hide-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          color: 'var(--text-muted)',
        }}>
          <span style={{ fontSize: 13 }}>{activeLocation.emoji}</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'Cinzel, serif', fontWeight: 600 }}>
            {activeLocation.name}
          </span>
          <span style={{ opacity: 0.5 }}>· {activeLocation.arc}</span>
        </div>
      </>
    )}

    {/* Spacer */}
    <div style={{ flex: 1 }} />

    {/* World indicator */}
    <div className="hide-mobile" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 9,
      fontFamily: 'Cinzel, serif',
      letterSpacing: '1px',
      color: 'var(--text-muted)',
      opacity: 0.6,
    }}>
      <span>EAST BLUE</span>
      <span>→</span>
      <span>GRAND LINE</span>
      <span>→</span>
      <span>NEW WORLD</span>
    </div>
  </header>
)

export default Header
