'use client'

import { useState, useCallback } from 'react'
import { useStickers } from '@/lib/hooks/useStickers'
import { CATALOG, CATALOG_BY_ID } from '@/lib/catalog/catalog'
import { QuickLoadInput } from './QuickLoadInput'
import { StatsStrip } from './Stat'
import { FilterChips } from './FilterChips'
import { DesktopAlbumView } from './DesktopAlbumView'
import { MobileAlbumView } from './MobileAlbumView'
import { Toast } from './Toast'

/**
 * Componente principal del álbum. Orquesta estado, tabs y vistas.
 * userId: null = modo localStorage sin login (para demo/prototipo)
 *         uuid = usuario autenticado (sync a Supabase)
 */
export function AlbumView({ userId }) {
  const { counts, loading, adjust, undo, getCount } = useStickers(userId)
  const [view, setView] = useState('album') // 'album' | 'repes' | 'faltan'
  const [filter, setFilter] = useState('todas')
  const [toastEvent, setToastEvent] = useState(null)

  // Contar tabs
  const totalDupes = CATALOG.reduce((acc, s) => {
    const c = getCount(s.id)
    return acc + (c >= 2 ? c - 1 : 0)
  }, 0)
  const totalMissing = CATALOG.filter((s) => getCount(s.id) === 0).length

  const handleAdjust = useCallback(
    (id, delta) => {
      const result = adjust(id, delta)
      if (result) setToastEvent(result)
      return result
    },
    [adjust]
  )

  const handleUndo = useCallback(() => {
    undo()
    setToastEvent(null)
  }, [undo])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        fontFamily: "'DM Mono', monospace",
        color: 'var(--ink-soft)',
        fontSize: 14,
      }}>
        Cargando álbum...
      </div>
    )
  }

  const tabs = [
    { id: 'album', label: 'Álbum', count: null },
    { id: 'repes', label: 'Mis Repes', count: totalDupes },
    { id: 'faltan', label: 'Lo que me falta', count: totalMissing },
  ]

  return (
    <>
      <StatsStrip getCount={getCount} />

      <QuickLoadInput getCount={getCount} onAdjust={handleAdjust} />

      {/* Tabs */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        borderBottom: '2px solid var(--ink)',
        background: 'var(--paper)',
        padding: '0 20px',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            style={{
              padding: '12px 18px',
              cursor: 'pointer',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 16,
              letterSpacing: '0.06em',
              color: view === tab.id ? 'var(--ink)' : 'var(--ink-soft)',
              borderBottom: `3px solid ${view === tab.id ? 'var(--accent)' : 'transparent'}`,
              background: 'none',
              border: 'none',
              borderBottom: view === tab.id ? '3px solid var(--accent)' : '3px solid transparent',
              marginBottom: -2,
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                marginLeft: 6,
                color: 'var(--ink-soft)',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <main style={{
        position: 'relative',
        zIndex: 2,
        padding: 20,
        maxWidth: 1400,
        margin: '0 auto',
      }}>
        {/* Filtros — ocultos en mobile cuando estamos en vista album */}
        <FilterChips
          current={filter}
          onChange={setFilter}
          hidden={false}
        />

        {view === 'album' && (
          <>
            {/* Mobile: solo en ≤768px */}
            <div className="mobile-only">
              <MobileAlbumView
                getCount={getCount}
                onAdjust={handleAdjust}
                filter={filter}
              />
            </div>
            {/* Desktop: solo en >768px */}
            <div className="desktop-only">
              <DesktopAlbumView
                getCount={getCount}
                onAdjust={handleAdjust}
                filter={filter}
              />
            </div>
          </>
        )}

        {view === 'repes' && (
          <ListView
            items={CATALOG.filter((s) => getCount(s.id) >= 2)}
            getCount={getCount}
            onAdjust={handleAdjust}
            filter={filter}
            isRepes
            emptyMsg="Todavía no tenés repetidas. Cargá tus sobres con el buscador de arriba ↑"
          />
        )}

        {view === 'faltan' && (
          <ListView
            items={CATALOG.filter((s) => getCount(s.id) === 0)}
            getCount={getCount}
            onAdjust={handleAdjust}
            filter={filter}
            emptyMsg="¡Completaste el álbum! 🏆 (¿en serio?)"
          />
        )}
      </main>

      <Toast event={toastEvent} onUndo={handleUndo} />
    </>
  )
}

// Vista lista (Repes y Faltantes)
function ListView({ items, getCount, onAdjust, filter, isRepes, emptyMsg }) {
  const filtered = filter === 'todas'
    ? items
    : items.filter((s) => s.group === filter)

  if (!filtered.length) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: 'var(--ink-soft)',
        fontFamily: "'DM Mono', monospace",
      }}>
        {emptyMsg}
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--paper)',
      border: '1.5px solid var(--ink)',
      boxShadow: '4px 4px 0 var(--ink)',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '70px 1fr 120px 120px',
        padding: '8px 14px',
        gap: 12,
        alignItems: 'center',
        background: 'var(--ink)',
        color: 'var(--paper)',
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
      }}>
        <div>Cód</div>
        <div>Nombre</div>
        <div>Selección</div>
        <div>{isRepes ? 'Repetidas' : 'Cantidad'}</div>
      </div>

      {filtered.map((s) => {
        const c = getCount(s.id)
        const displayCount = isRepes ? Math.max(0, c - 1) : c
        return (
          <div
            key={s.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '70px 1fr 120px 120px',
              padding: '8px 14px',
              gap: 12,
              alignItems: 'center',
              borderBottom: '1px dashed rgba(0,0,0,0.1)',
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
            }}
          >
            <div style={{ color: 'var(--accent)', fontWeight: 500 }}>
              {s.code} {s.orderInSet}
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14 }}>
              {s.flag} {s.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
              {s.seleccionName}
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button
                onClick={() => onAdjust(s.id, -1)}
                style={{
                  width: 26, height: 26,
                  border: '1px solid var(--ink)',
                  background: 'var(--paper)',
                  cursor: 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16,
                }}
              >−</button>
              <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 500, fontSize: 14 }}>
                {displayCount}
              </span>
              <button
                onClick={() => onAdjust(s.id, +1)}
                style={{
                  width: 26, height: 26,
                  border: '1px solid var(--ink)',
                  background: 'var(--paper)',
                  cursor: 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16,
                }}
              >+</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
