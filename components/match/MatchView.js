'use client'

import { useState } from 'react'

export function MatchView({ profileA, profileB, yoDoy, elDa }) {
  const [copied, setCopied] = useState(false)

  const total = yoDoy.length + elDa.length

  function buildWhatsAppMsg() {
    const url = window.location.href
    const yoDoyList = yoDoy.slice(0, 10).map((m) => `${m.sticker.code} ${m.sticker.orderInSet} ${m.sticker.name}`).join(', ')
    const elDaList = elDa.slice(0, 10).map((m) => `${m.sticker.code} ${m.sticker.orderInSet} ${m.sticker.name}`).join(', ')

    let msg = `🏆 *LateNola — Match Panini Mundial 2026*\n\n`
    msg += `*${profileA.display_name || profileA.username} vs ${profileB.display_name || profileB.username}*\n\n`
    if (yoDoy.length) msg += `📤 *Yo te doy (${yoDoy.length}):* ${yoDoyList}${yoDoy.length > 10 ? '...' : ''}\n\n`
    if (elDa.length) msg += `📥 *Me das (${elDa.length}):* ${elDaList}${elDa.length > 10 ? '...' : ''}\n\n`
    msg += `Ver el cruce completo: ${url}`
    return encodeURIComponent(msg)
  }

  function handleShare() {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const whatsappHref = profileB.whatsapp
    ? `https://wa.me/${profileB.whatsapp.replace(/\D/g, '')}?text=${buildWhatsAppMsg()}`
    : null

  return (
    <main style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
      {/* Header del match */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        padding: '20px 24px',
        background: 'var(--ink)',
        color: 'var(--paper)',
        boxShadow: '4px 4px 0 var(--accent)',
      }}>
        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28,
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}>
            {profileA.display_name || profileA.username}
            <span style={{ color: 'var(--accent)', margin: '0 12px' }}>VS</span>
            {profileB.display_name || profileB.username}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: 'rgba(244,237,224,0.6)',
            marginTop: 4,
          }}>
            {total > 0
              ? `${total} figuritas para intercambiar`
              : 'Sin matches por ahora — volvé cuando carguen más figuritas'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={handleShare}
            style={{
              padding: '8px 14px',
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              background: 'transparent',
              color: copied ? '#25D366' : 'var(--paper)',
              border: '1px solid var(--paper)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {copied ? '¡Copiado!' : 'Copiar link'}
          </button>

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '8px 14px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 16,
                letterSpacing: '0.04em',
                background: '#25D366',
                color: 'white',
                textDecoration: 'none',
                border: '2px solid white',
              }}
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {total === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          fontFamily: "'Fraunces', serif",
          fontSize: 18,
          color: 'var(--ink-soft)',
          lineHeight: 1.6,
        }}>
          No hay figuritas para intercambiar todavía.<br />
          Carguen más en sus álbumes y vuelvan a ver el match.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}
        className="match-grid"
        >
          {/* Columna A → B */}
          <MatchColumn
            title={`${profileA.display_name || profileA.username} te da`}
            subtitle={`${yoDoy.length} figuritas`}
            items={yoDoy}
            color="var(--have)"
            icon="📤"
          />

          {/* Columna B → A */}
          <MatchColumn
            title={`${profileB.display_name || profileB.username} te da`}
            subtitle={`${elDa.length} figuritas`}
            items={elDa}
            color="var(--dupe)"
            icon="📥"
          />
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .match-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}

function MatchColumn({ title, subtitle, items, color, icon }) {
  return (
    <div style={{
      background: 'var(--paper)',
      border: '1.5px solid var(--ink)',
      boxShadow: '4px 4px 0 var(--ink)',
    }}>
      {/* Header columna */}
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
          {icon} {title}
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: 'var(--ink-soft)',
          marginTop: 2,
        }}>
          {subtitle}
        </div>
      </div>

      {/* Lista */}
      {!items.length ? (
        <div style={{
          padding: '24px 16px',
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          color: 'var(--ink-soft)',
          textAlign: 'center',
        }}>
          Nada por acá
        </div>
      ) : (
        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
          {items.map(({ sticker: s, count }) => (
            <div key={s.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '7px 14px',
              borderBottom: '1px dashed rgba(0,0,0,0.08)',
            }}>
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
              {count > 1 && (
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color,
                  fontWeight: 500,
                  flexShrink: 0,
                }}>
                  ×{count}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
