'use client'

const SHIELD_TIP = 'Los escudos solo se intercambian por otros escudos'

export function FixedSideList({ profile, repes, color, counterpartHasShields }) {
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
          {profile.display_name || profile.username} pone
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: 'var(--ink-soft)',
          marginTop: 2,
        }}>
          {repes.length} figuritas · lista fija
        </div>
      </div>

      {repes.length === 0 ? (
        <div style={{
          padding: '24px 16px',
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          color: 'var(--ink-soft)',
          textAlign: 'center',
        }}>
          Sin repes todavía
        </div>
      ) : (
        <div style={{ maxHeight: 480, overflowY: 'auto' }}>
          {repes.map(({ sticker: s, count }) => {
            const isShield = s.type === 'escudo'
            const blocked = isShield && counterpartHasShields === false
            return (
              <StickerTile
                key={s.id}
                sticker={s}
                count={count}
                blocked={blocked}
                tooltip={blocked ? SHIELD_TIP : null}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function StickerTile({ sticker: s, count, blocked, tooltip }) {
  return (
    <div
      title={tooltip || undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '7px 14px',
        borderBottom: '1px dashed rgba(0,0,0,0.08)',
        opacity: blocked ? 0.4 : 1,
        cursor: tooltip ? 'help' : 'default',
        position: 'relative',
      }}
    >
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: 'var(--accent)',
        fontWeight: 500,
        minWidth: 52,
        flexShrink: 0,
      }}>
        {s.code} {s.orderInSet}
      </span>
      <span style={{ fontSize: 14 }}>{s.flag}</span>
      <span style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 13,
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {s.name}
      </span>
      {blocked && (
        <span style={{ flexShrink: 0, fontSize: 12 }}>🔒</span>
      )}
      {!blocked && count > 1 && (
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: 'var(--dupe)',
          fontWeight: 500,
          flexShrink: 0,
        }}>
          ×{count - 1}
        </span>
      )}
    </div>
  )
}
