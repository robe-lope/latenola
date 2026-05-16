'use client'

import { useState, useEffect } from 'react'
import { StickerComboRow } from './StickerComboRow'

export function ComboboxSide({ profile, repes, N, fixedRepes, color, onChange }) {
  const [selected, setSelected] = useState(() => Array(N).fill(null))

  function handleChange(i, stickerId) {
    setSelected((prev) => {
      const next = [...prev]
      next[i] = stickerId
      return next
    })
  }

  useEffect(() => {
    onChange(selected)
  }, [selected])

  // IDs ya seleccionados (para deshabilitar en otras filas)
  const selectedSet = new Set(selected.filter(Boolean))

  return (
    <div style={{
      background: 'var(--paper)',
      border: '1.5px solid var(--ink)',
      boxShadow: '4px 4px 0 var(--ink)',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: `3px solid ${color}`,
        background: 'var(--paper-dark)',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 18,
          letterSpacing: '0.04em',
        }}>
          {profile.display_name || profile.username} elige
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: 'var(--ink-soft)',
          marginTop: 2,
        }}>
          tiene {repes.length} repes · elegí {N} para dar
        </div>
      </div>

      <div style={{ maxHeight: 480, overflowY: 'auto' }}>
        {Array.from({ length: N }, (_, i) => (
          <StickerComboRow
            key={i}
            index={i}
            repes={repes}
            disabledIds={selectedSet}
            fixedSticker={fixedRepes[i]?.sticker ?? null}
            value={selected[i]}
            onChange={(id) => handleChange(i, id)}
          />
        ))}
      </div>
    </div>
  )
}
