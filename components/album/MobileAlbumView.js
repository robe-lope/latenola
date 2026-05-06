'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { CATALOG_BY_SELECCION, SELECCIONES_LIST } from '@/lib/catalog/catalog'
import { FiguTile } from './FiguTile'

/**
 * Vista mobile del álbum: swipe horizontal entre selecciones + ruedita inferior.
 * Sincronización bidireccional con flag syncSource para evitar feedback loop.
 * Update optimista: tap en figu no re-renderiza todo, solo actualiza el tile via onAdjust
 * que levanta el estado al padre (el estado ya es reactivo, React actualiza solo el tile).
 */
export function MobileAlbumView({ getCount, onAdjust, filter }) {
  const selecciones = filter === 'todas'
    ? SELECCIONES_LIST
    : SELECCIONES_LIST.filter((s) => s.group === filter)

  const [currentIdx, setCurrentIdx] = useState(0)
  const pagesRef = useRef(null)
  const wheelRef = useRef(null)
  const syncSourceRef = useRef(null) // 'pages' | 'wheel' | null
  const pagesTimerRef = useRef(null)
  const wheelTimerRef = useRef(null)

  const currentSel = selecciones[currentIdx]
  const currentStickers = currentSel ? (CATALOG_BY_SELECCION[currentSel.code] || []) : []
  const have = currentStickers.filter((s) => getCount(s.id) >= 1).length
  const pct = currentStickers.length ? Math.round((have / currentStickers.length) * 100) : 0

  // Centrar la ruedita en el item activo
  const centerWheel = useCallback((idx) => {
    const wheel = wheelRef.current
    if (!wheel) return
    const items = wheel.querySelectorAll('[data-wheel-item]')
    const target = items[idx]
    if (!target) return
    const wheelRect = wheel.getBoundingClientRect()
    const itemRect = target.getBoundingClientRect()
    wheel.scrollTo({
      left: wheel.scrollLeft + itemRect.left - wheelRect.left - wheelRect.width / 2 + itemRect.width / 2,
      behavior: 'smooth',
    })
  }, [])

  // Navegar a una selección (desde la ruedita o tap)
  const navigateTo = useCallback((idx, source) => {
    if (idx < 0 || idx >= selecciones.length) return
    if (idx === currentIdx && source !== 'init') return

    setCurrentIdx(idx)

    if (source !== 'wheel') {
      syncSourceRef.current = 'pages'
      centerWheel(idx)
      setTimeout(() => { syncSourceRef.current = null }, 400)
    }

    if (source !== 'pages') {
      syncSourceRef.current = 'wheel'
      const pages = pagesRef.current
      if (pages) {
        pages.scrollTo({ left: pages.clientWidth * idx, behavior: 'smooth' })
      }
      setTimeout(() => { syncSourceRef.current = null }, 400)
    }
  }, [currentIdx, selecciones.length, centerWheel])

  // Listener scroll de páginas (swipe del usuario)
  useEffect(() => {
    const pages = pagesRef.current
    if (!pages) return

    function onScroll() {
      if (syncSourceRef.current === 'wheel') return
      clearTimeout(pagesTimerRef.current)
      pagesTimerRef.current = setTimeout(() => {
        const idx = Math.round(pages.scrollLeft / pages.clientWidth)
        if (idx !== currentIdx) navigateTo(idx, 'pages')
      }, 80)
    }

    pages.addEventListener('scroll', onScroll, { passive: true })
    return () => pages.removeEventListener('scroll', onScroll)
  }, [currentIdx, navigateTo])

  // Listener scroll de ruedita (drag del usuario)
  useEffect(() => {
    const wheel = wheelRef.current
    if (!wheel) return

    function onScroll() {
      if (syncSourceRef.current === 'pages') return
      clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(() => {
        const items = [...wheel.querySelectorAll('[data-wheel-item]')]
        const wheelCenter = wheel.scrollLeft + wheel.clientWidth / 2
        let closest = 0
        let closestDist = Infinity
        items.forEach((el, i) => {
          const elCenter = el.offsetLeft + el.offsetWidth / 2
          const dist = Math.abs(elCenter - wheelCenter)
          if (dist < closestDist) { closestDist = dist; closest = i }
        })
        if (closest !== currentIdx) navigateTo(closest, 'wheel')
      }, 100)
    }

    wheel.addEventListener('scroll', onScroll, { passive: true })
    return () => wheel.removeEventListener('scroll', onScroll)
  }, [currentIdx, navigateTo])

  // Posicionar ruedita en el primer item al montar
  useEffect(() => {
    requestAnimationFrame(() => centerWheel(0))
  }, [centerWheel])

  if (!selecciones.length) return null

  return (
    <div style={{ position: 'relative', margin: '-20px -20px 0', background: 'var(--paper)' }}>
      {/* Header: progreso de la selección actual */}
      <div style={{
        padding: '10px 16px 8px',
        borderBottom: '1px dashed var(--ink)',
        background: 'var(--paper-dark)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{currentSel?.flag}</span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, overflow: 'hidden' }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: '0.04em',
              lineHeight: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {currentSel?.name}
            </span>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: 'var(--ink-soft)',
              padding: '2px 6px',
              border: '1px solid var(--ink-soft)',
              flexShrink: 0,
            }}>
              {currentSel?.code}
            </span>
          </div>
          <div style={{
            height: 4,
            background: 'var(--paper)',
            border: '1px solid var(--ink-soft)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: '0 auto 0 0',
              background: 'var(--have)',
              width: `${pct}%`,
              transition: 'width 0.25s',
            }} />
          </div>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: 'var(--ink-soft)',
          flexShrink: 0,
        }}>
          {have}/{currentStickers.length}
        </div>
      </div>

      {/* Páginas con swipe */}
      <div
        ref={pagesRef}
        className="scrollbar-none"
        style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {selecciones.map((sel, idx) => {
          const stickers = CATALOG_BY_SELECCION[sel.code] || []
          return (
            <div
              key={sel.code}
              data-page-idx={idx}
              data-code={sel.code}
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                padding: '14px 16px 80px',
                minHeight: '50vh',
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 6,
              }}>
                {stickers.map((s) => (
                  <FiguTile
                    key={s.id}
                    sticker={s}
                    count={getCount(s.id)}
                    onAdjust={onAdjust}
                    variant="mobile"
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Ruedita inferior */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        background: 'var(--paper)',
        borderTop: '2px solid var(--ink)',
        padding: '10px 0 14px',
        boxShadow: '0 -4px 12px var(--shadow)',
      }}>
        {/* Indicador central */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 6,
          bottom: 6,
          width: 2,
          transform: 'translateX(-50%)',
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 2,
        }}>
          {/* Flechita arriba */}
          <div style={{
            position: 'absolute',
            top: -1,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: '6px solid var(--accent)',
          }} />
          {/* Flechita abajo */}
          <div style={{
            position: 'absolute',
            bottom: -1,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid var(--accent)',
          }} />
        </div>

        <div
          ref={wheelRef}
          className="scrollbar-none"
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            // Padding de 50vw para que el primero y último puedan centrarse
            paddingLeft: '50vw',
            paddingRight: '50vw',
          }}
        >
          {selecciones.map((sel, idx) => {
            const isActive = idx === currentIdx
            const isNear = Math.abs(idx - currentIdx) === 1
            return (
              <div
                key={sel.code}
                data-wheel-item={idx}
                onClick={() => navigateTo(idx, 'click')}
                style={{
                  flex: '0 0 72px',
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 0',
                  cursor: 'pointer',
                  opacity: isActive ? 1 : isNear ? 0.75 : 0.45,
                  transform: isActive ? 'scale(1.05)' : 'scale(0.85)',
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
              >
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16,
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  color: isActive ? 'var(--accent)' : 'var(--ink)',
                }}>
                  {sel.code}
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: 'var(--ink-soft)',
                  marginTop: 2,
                  letterSpacing: '0.05em',
                }}>
                  P.{idx + 1}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
