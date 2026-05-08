'use client'

import { useState } from 'react'
import Link from 'next/link'

export function PublicProfile({ profile, counts, stats, repes, faltan, matchUsername }) {
  const [tab, setTab] = useState('repes')

  const items = tab === 'repes' ? repes : faltan

  return (
    <main style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto', padding: '24px 20px' }}>
      {/* Header del perfil */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
        padding: '20px 24px',
        background: 'var(--paper-dark)',
        border: '2px solid var(--ink)',
        boxShadow: '4px 4px 0 var(--ink)',
        flexWrap: wrap,
      }}>
        <div style={{ fontSize: 48, lineHeight: 1 }}>{profile.avatar_emoji || '⚽'}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28,
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}>
            {profile.display_name || profile.username}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: 'var(--ink-soft)',
            marginTop: 4,
          }}>
            @{profile.username}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          {matchUsername && (
            <Link
              href={`/match/${matchUsername}-vs-${profile.username}`}
              style={{
                display: 'inline-block',
                padding: '10px 16px',
                background: 'var(--accent)',
                color: 'white',
                textDecoration: 'none',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 16,
                letterSpacing: '0.04em',
                border: '2px solid var(--ink)',
                boxShadow: '3px 3px 0 var(--ink)',
              }}
            >
              ⚡ Ver match
            </Link>
          )}
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                background: '#25D366',
                color: 'white',
                textDecoration: 'none',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 16,
                letterSpacing: '0.04em',
                border: '2px solid var(--ink)',
              }}
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        border: '1.5px solid var(--ink)',
        boxShadow: '4px 4px 0 var(--ink)',
        marginBottom: 24,
        background: 'var(--paper)',
      }}>
        {[
          { label: 'Pegadas', value: stats.have, extra: `${stats.pct}%` },
          { label: 'Repetidas', value: stats.dupes },
          { label: 'Faltan', value: stats.missing },
          { label: 'Total', value: stats.total },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: '12px 14px',
            borderRight: i < 3 ? '1px dashed rgba(0,0,0,0.2)' : 'none',
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-soft)',
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 26,
              lineHeight: 1,
            }}>
              {s.value}
              {s.extra && (
                <span style={{ fontSize: 12, color: 'var(--ink-soft)', marginLeft: 4 }}>{s.extra}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso del álbum */}
      <div style={{
        height: 8,
        background: 'var(--paper-dark)',
        border: '1px solid var(--ink)',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: '0 auto 0 0',
          background: 'var(--have)',
          width: `${stats.pct}%`,
          transition: 'width 0.5s',
        }} />
      </div>

      {/* Tabs repes / faltan */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid var(--ink)',
        marginBottom: 20,
      }}>
        {[
          { id: 'repes', label: `Repes disponibles`, count: repes.length },
          { id: 'faltan', label: `Le faltan`, count: faltan.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 16,
              letterSpacing: '0.04em',
              color: tab === t.id ? 'var(--ink)' : 'var(--ink-soft)',
              borderBottom: tab === t.id ? '3px solid var(--accent)' : '3px solid transparent',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? '3px solid var(--accent)' : '3px solid transparent',
              marginBottom: -2,
              cursor: 'pointer',
            }}
          >
            {t.label}{' '}
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: 'var(--ink-soft)',
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {!items.length ? (
        <div style={{
          padding: 40,
          textAlign: 'center',
          fontFamily: "'DM Mono', monospace",
          color: 'var(--ink-soft)',
        }}>
          {tab === 'repes' ? 'No tiene repetidas por ahora.' : '¡Álbum completo! 🏆'}
        </div>
      ) : (
        <div style={{
          background: 'var(--paper)',
          border: '1.5px solid var(--ink)',
          boxShadow: '4px 4px 0 var(--ink)',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr 100px',
            padding: '8px 14px',
            background: 'var(--ink)',
            color: 'var(--paper)',
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            gap: 12,
          }}>
            <div>Cód</div>
            <div>Nombre</div>
            <div>{tab === 'repes' ? 'Repes' : ''}</div>
          </div>

          {items.map((s) => {
            const c = counts[s.id] || 0
            const displayCount = tab === 'repes' ? c - 1 : null
            return (
              <div key={s.id} style={{
                display: 'grid',
                gridTemplateColumns: '70px 1fr 100px',
                padding: '8px 14px',
                gap: 12,
                alignItems: 'center',
                borderBottom: '1px dashed rgba(0,0,0,0.1)',
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
              }}>
                <div style={{ color: 'var(--accent)', fontWeight: 500 }}>
                  {s.code} {s.orderInSet}
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14 }}>
                  {s.flag} {s.name}
                </div>
                <div style={{ color: 'var(--dupe)', fontWeight: 500 }}>
                  {displayCount !== null && displayCount > 0 ? `×${displayCount}` : ''}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
