'use client'

/**
 * Tile de figurita reutilizable para desktop y mobile.
 * variant: 'desktop' | 'mobile'
 */
export function FiguTile({ sticker, count, onAdjust, variant = 'desktop' }) {
  const cls = count === 0 ? '' : count === 1 ? 'have' : 'dupe'

  function handleClick(e) {
    e.preventDefault()
    onAdjust(sticker.id, +1)
  }

  function handleContextMenu(e) {
    e.preventDefault()
    onAdjust(sticker.id, -1)
  }

  if (variant === 'mobile') {
    return (
      <div
        className={`ma-figu ${cls} ${sticker.isSpecial ? 'special' : ''}`}
        data-id={sticker.id}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        style={{
          aspectRatio: '3/4',
          background: cls === 'have' ? 'var(--have)' : cls === 'dupe' ? 'var(--dupe)' : 'var(--missing)',
          color: cls ? 'white' : 'var(--ink)',
          position: 'relative',
          border: '1.5px solid var(--ink)',
          boxShadow: '2px 2px 0 var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '5px 5px 7px',
          cursor: 'pointer',
          userSelect: 'none',
          overflow: 'hidden',
          minWidth: 0,
          transition: 'transform 0.08s, background 0.1s',
        }}
      >
        {sticker.isSpecial && (
          <span style={{
            position: 'absolute', top: 3, right: 5,
            color: 'var(--gold)', fontSize: 12,
          }}>★</span>
        )}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          opacity: 0.85,
          whiteSpace: 'nowrap',
        }}>
          {sticker.code} {sticker.orderInSet}
        </div>
        <div style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 11,
          lineHeight: 1.15,
          fontWeight: 600,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
        }}>
          {sticker.name}
        </div>
        {count >= 2 && (
          <div className="ma-dupe-count" style={{
            position: 'absolute', bottom: 3, right: 4,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: 500,
            background: 'rgba(0,0,0,0.35)',
            padding: '1px 5px',
            borderRadius: 2,
          }}>
            ×{count}
          </div>
        )}
      </div>
    )
  }

  // Desktop
  return (
    <div
      className={`figu ${cls} ${sticker.isSpecial ? 'special' : ''}`}
      data-id={sticker.id}
      title={sticker.name}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{
        aspectRatio: '3/4',
        background: cls === 'have' ? 'var(--have)' : cls === 'dupe' ? 'var(--dupe)' : 'var(--missing)',
        color: cls ? 'white' : 'var(--ink)',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4px 4px 6px',
        transition: 'background 0.1s',
        userSelect: 'none',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      {sticker.isSpecial && (
        <span style={{
          position: 'absolute', top: 2, right: 3,
          color: 'var(--gold)', fontSize: 10,
        }}>★</span>
      )}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 9,
        fontWeight: 500,
        opacity: 0.85,
        whiteSpace: 'nowrap',
      }}>
        {sticker.code} {sticker.orderInSet}
      </div>
      <div style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 9,
        lineHeight: 1.15,
        fontWeight: 600,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        wordBreak: 'break-word',
      }}>
        {sticker.name}
      </div>
      {count >= 2 && (
        <div style={{
          position: 'absolute', bottom: 2, right: 3,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          fontWeight: 500,
          background: 'rgba(0,0,0,0.3)',
          padding: '0 4px',
          borderRadius: 2,
        }}>
          ×{count}
        </div>
      )}
    </div>
  )
}
