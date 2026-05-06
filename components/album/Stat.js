'use client'

import { useMemo } from 'react'
import { CATALOG } from '@/lib/catalog/catalog'

export function StatsStrip({ getCount }) {
  const stats = useMemo(() => {
    let have = 0
    let dupes = 0
    CATALOG.forEach((s) => {
      const c = getCount(s.id)
      if (c >= 1) have++
      if (c >= 2) dupes += c - 1
    })
    const total = CATALOG.length
    const missing = total - have
    const pct = Math.round((have / total) * 100)
    return { have, dupes, missing, total, pct }
  }, [getCount])

  const items = [
    { label: 'Pegadas', value: stats.have, extra: `${stats.pct}%` },
    { label: 'Repetidas', value: stats.dupes, extra: null },
    { label: 'Faltan', value: stats.missing, extra: null },
    { label: 'Total álbum', value: stats.total, extra: null },
  ]

  return (
    <div style={{
      position: 'relative',
      zIndex: 2,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      borderBottom: '1px solid var(--ink)',
      background: 'var(--paper-dark)',
    }}>
      {items.map((item, i) => (
        <div key={item.label} style={{
          padding: '10px 14px',
          borderRight: i < 3 ? '1px dashed rgba(0,0,0,0.2)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: 'var(--ink-soft)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            {item.label}
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26,
            lineHeight: 1,
          }}>
            {item.value}
            {item.extra && (
              <span style={{ fontSize: 13, color: 'var(--ink-soft)', marginLeft: 4 }}>
                {item.extra}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
