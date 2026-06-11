const btnStyle = {
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(10,21,53,0.9)',
  border: '1px solid var(--border-dim)',
  borderRadius: 8,
  color: 'var(--text-muted)',
  fontSize: 18,
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
  transition: 'border-color 0.2s, color 0.2s',
  userSelect: 'none',
}

const ZoomControls = ({ onZoomIn, onZoomOut, onReset }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 48,
      right: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      zIndex: 30,
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <button
      style={btnStyle}
      onClick={onZoomIn}
      title="Zoom in"
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)' }}
    >
      +
    </button>
    <button
      style={{ ...btnStyle, fontSize: 14 }}
      onClick={onReset}
      title="Reset view"
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)' }}
    >
      ⌂
    </button>
    <button
      style={{ ...btnStyle, fontSize: 22 }}
      onClick={onZoomOut}
      title="Zoom out"
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)' }}
    >
      −
    </button>
  </div>
)

export default ZoomControls
