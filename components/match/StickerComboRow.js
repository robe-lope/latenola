'use client'

const SHIELD_TIP = 'Los escudos solo se intercambian por otros escudos'

export function StickerComboRow({ index, repes, disabledIds, fixedSticker, value, onChange }) {
  const selected = value ? repes.find((r) => r.sticker.id === value) : null
  const selectedType = selected?.sticker.type ?? null
  const fixedType = fixedSticker?.type ?? null

  const typeMismatch =
    selected !== null &&
    fixedType !== null &&
    ((fixedType === 'escudo') !== (selectedType === 'escudo'))

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 14px',
      borderBottom: '1px dashed rgba(0,0,0,0.08)',
      background: typeMismatch ? 'rgba(214,40,40,0.04)' : undefined,
    }}>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: 'var(--ink-soft)',
        minWidth: 20,
        flexShrink: 0,
      }}>
        {index + 1}.
      </span>

      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        style={{
          flex: 1,
          padding: '6px 8px',
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          background: 'var(--paper-dark)',
          border: `1.5px solid ${typeMismatch ? 'var(--accent)' : 'var(--ink)'}`,
          color: 'var(--ink)',
          cursor: 'pointer',
          minWidth: 0,
        }}
      >
        <option value="">— elegí una figurita —</option>
        {repes.map(({ sticker: s }) => (
          <option
            key={s.id}
            value={s.id}
            disabled={disabledIds.has(s.id) && s.id !== value}
          >
            {s.code} {s.orderInSet} {s.flag} {s.name}
          </option>
        ))}
      </select>

      {typeMismatch && (
        <span
          title={SHIELD_TIP}
          style={{ fontSize: 14, flexShrink: 0, cursor: 'help' }}
        >
          🔒
        </span>
      )}
    </div>
  )
}
