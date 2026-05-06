'use client'

import { useEffect, useRef, useState } from 'react'

export function Toast({ event, onUndo }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!event) return
    setVisible(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(timerRef.current)
  }, [event])

  if (!event) return null

  const { before, after, sticker } = event
  let action = ''
  if (after > before) {
    action = after === 1 ? 'PEGADA' : `REPE +${after - 1}`
  } else {
    action = after === 0 ? 'BORRADA' : 'RESTADA'
  }

  function handleUndo() {
    setVisible(false)
    onUndo()
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      background: 'var(--ink)',
      color: 'var(--paper)',
      padding: '12px 18px',
      borderRadius: 4,
      fontFamily: "'DM Mono', monospace",
      fontSize: 13,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.2s, transform 0.2s',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{action}</span>
      <span style={{ color: 'var(--gold)', fontWeight: 500 }}>
        {sticker?.code} {sticker?.orderInSet}
      </span>
      <span>{sticker?.flag} {sticker?.name}</span>
      <button
        onClick={handleUndo}
        style={{
          marginLeft: 12,
          padding: '4px 10px',
          background: 'var(--accent)',
          color: 'var(--paper)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        deshacer
      </button>
    </div>
  )
}
