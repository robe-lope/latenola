'use client'

import { GROUPS } from '@/lib/catalog/catalog'

export function FilterChips({ current, onChange, hidden }) {
  if (hidden) return null

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      marginBottom: 16,
      flexWrap: 'wrap',
      alignItems: 'center',
    }}>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--ink-soft)',
      }}>
        Filtrar:
      </span>
      {GROUPS.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          style={{
            padding: '4px 10px',
            cursor: 'pointer',
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            background: g === current ? 'var(--ink)' : 'var(--paper)',
            color: g === current ? 'var(--paper)' : 'var(--ink)',
            border: '1px solid var(--ink)',
            transition: 'all 0.15s',
          }}
        >
          {g}
        </button>
      ))}
    </div>
  )
}
