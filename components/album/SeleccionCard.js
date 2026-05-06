'use client'

import { FiguTile } from './FiguTile'

export function SeleccionCard({ seleccion, stickers, getCount, onAdjust }) {
  const have = stickers.filter((s) => getCount(s.id) >= 1).length
  const pct = Math.round((have / stickers.length) * 100)

  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '1.5px solid var(--ink)',
        boxShadow: '4px 4px 0 var(--ink)',
        transition: 'transform 0.1s, box-shadow 0.1s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)'
        e.currentTarget.style.boxShadow = '6px 6px 0 var(--ink)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '1px dashed var(--ink)',
        background: 'var(--paper-dark)',
      }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>{seleccion.flag}</span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 18,
          letterSpacing: '0.04em',
          flex: 1,
        }}>
          {seleccion.seleccionName}
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: 'var(--ink-soft)',
          padding: '2px 6px',
          background: 'var(--paper)',
          border: '1px solid var(--ink-soft)',
        }}>
          {seleccion.code}
        </span>
      </div>

      {/* Barra de progreso */}
      <div style={{ height: 4, background: 'var(--paper-dark)', borderBottom: '1px dashed rgba(0,0,0,0.2)' }}>
        <div style={{
          height: '100%',
          background: 'var(--have)',
          width: `${pct}%`,
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Grilla 5×4 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 2,
        background: 'var(--ink-soft)',
        padding: 2,
      }}>
        {stickers.map((s) => (
          <FiguTile
            key={s.id}
            sticker={s}
            count={getCount(s.id)}
            onAdjust={onAdjust}
            variant="desktop"
          />
        ))}
      </div>
    </div>
  )
}
