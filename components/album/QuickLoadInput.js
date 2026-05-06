'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CATALOG } from '@/lib/catalog/catalog'

/**
 * QuickLoadInput — el speedrun de carga de figuritas.
 * Acepta: "ARG 13", "ARG13", "arg 13", "AR 13" (si hay un solo match)
 * Enter = +1, Shift+Enter = -1
 * Smart cursor: deja el código en el input tras confirmar
 * Tecla "/" = foco desde cualquier parte
 */
export function QuickLoadInput({ getCount, onAdjust }) {
  const inputRef = useRef(null)
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [open, setOpen] = useState(false)

  // "/" global = foco al input
  useEffect(() => {
    function handleGlobal(e) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleGlobal)
    return () => document.removeEventListener('keydown', handleGlobal)
  }, [])

  const parseInput = useCallback((raw) => {
    const t = raw.trim().toUpperCase()
    if (!t) return []
    const m = t.match(/^([A-Z]{2,4})\s*(\d+)?$/)
    if (!m) return []
    const codePart = m[1]
    const numPart = m[2]

    const matchingCodes = [...new Set(CATALOG.map((s) => s.code))].filter((c) =>
      c.startsWith(codePart)
    )

    if (numPart) {
      const n = parseInt(numPart)
      const results = []
      matchingCodes.forEach((c) => {
        const sticker = CATALOG.find((s) => s.code === c && s.orderInSet === n)
        if (sticker) results.push(sticker)
      })
      return results.slice(0, 8)
    } else {
      return matchingCodes
        .flatMap((c) => CATALOG.filter((s) => s.code === c).slice(0, 4))
        .slice(0, 8)
    }
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setValue(val)
    const matches = parseInput(val)
    setSuggestions(matches)
    setActiveIdx(matches.length ? 0 : -1)
    setOpen(matches.length > 0)
  }

  function handleKeyDown(e) {
    const matches = parseInput(value)

    if (e.key === 'Enter') {
      e.preventDefault()
      if (!matches.length) return
      const target = matches[Math.max(0, activeIdx)]
      const delta = e.shiftKey ? -1 : +1
      const result = onAdjust(target.id, delta)

      // Smart cursor: dejar el código listo para el siguiente número
      const m = value.trim().toUpperCase().match(/^([A-Z]{2,4})/)
      setValue(m ? m[1] + ' ' : '')
      setSuggestions([])
      setOpen(false)
      setActiveIdx(0)

      return result
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (matches.length) setActiveIdx((i) => (i + 1) % matches.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (matches.length)
        setActiveIdx((i) => (i - 1 + matches.length) % matches.length)
    } else if (e.key === 'Escape') {
      setValue('')
      setSuggestions([])
      setOpen(false)
      setActiveIdx(0)
    }
  }

  function handleSuggestionClick(sticker) {
    onAdjust(sticker.id, +1)
    setValue('')
    setSuggestions([])
    setOpen(false)
    setActiveIdx(0)
    inputRef.current?.focus()
  }

  function stateLabel(id) {
    const c = getCount(id)
    if (c === 0) return 'falta'
    if (c === 1) return 'pegada'
    return `+${c - 1} repe`
  }

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'var(--ink)',
      color: 'var(--paper)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 4px 12px var(--shadow)',
    }}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22,
        color: 'var(--gold)',
        letterSpacing: '0.04em',
      }}>»</div>

      <div style={{ flex: 1, position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => suggestions.length && setOpen(true)}
          placeholder="Tipeá: ARG 13, BRA 5, FWC 1..."
          autoComplete="off"
          spellCheck={false}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--paper)',
            fontFamily: "'DM Mono', monospace",
            fontSize: 18,
            padding: '4px 8px',
            borderBottom: '2px solid var(--gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        />

        {open && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--paper)',
            color: 'var(--ink)',
            border: '2px solid var(--ink)',
            borderTop: 'none',
            maxHeight: 260,
            overflowY: 'auto',
            boxShadow: '0 8px 16px var(--shadow)',
            zIndex: 20,
          }}>
            {suggestions.map((s, i) => (
              <div
                key={s.id}
                onMouseDown={() => handleSuggestionClick(s)}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  borderBottom: '1px dashed rgba(0,0,0,0.1)',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  background: i === activeIdx ? 'var(--gold)' : 'transparent',
                }}
              >
                <span style={{
                  fontWeight: 500,
                  color: 'var(--accent)',
                  minWidth: 50,
                }}>
                  {s.code} {s.orderInSet}
                </span>
                <span style={{ flex: 1, fontFamily: "'Fraunces', serif" }}>
                  {s.flag} {s.name}
                </span>
                <span style={{ fontSize: 10, opacity: 0.6, textTransform: 'uppercase' }}>
                  {stateLabel(s.id)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: 'rgba(244,237,224,0.5)',
        whiteSpace: 'nowrap',
      }}>
        Enter = sumar · Shift+Enter = restar · ↑↓ navegar
      </div>
    </div>
  )
}
