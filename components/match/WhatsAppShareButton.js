'use client'

export function WhatsAppShareButton({
  profileA,
  profileB,
  aRepes,      // array de { sticker, count } que A ofrece
  bRepes,      // array de { sticker, count } que B ofrece
  hasCombobox,
  allSelected, // si hay combobox: ¿todos los slots están llenos?
  hasBlocked,  // ¿alguna fila tiene type mismatch?
}) {
  if (!profileB.whatsapp) return null

  const canShare = (!hasCombobox || allSelected) && !hasBlocked

  function buildMsg() {
    const url = window.location.href
    const fmt = (items) =>
      items
        .slice(0, 10)
        .map(({ sticker: s }) => `${s.code} ${s.orderInSet} (${s.name})`)
        .join(', ') + (items.length > 10 ? '...' : '')

    let msg = `🏆 *LateNola — Match Panini Mundial 2026*\n\n`
    msg += `*${profileA.display_name || profileA.username} vs ${profileB.display_name || profileB.username}*\n\n`
    if (aRepes.length) msg += `📤 *${profileA.display_name || profileA.username} da (${aRepes.length}):* ${fmt(aRepes)}\n\n`
    if (bRepes.length) msg += `📥 *${profileB.display_name || profileB.username} da (${bRepes.length}):* ${fmt(bRepes)}\n\n`
    msg += `Ver el cruce completo: ${url}`
    return encodeURIComponent(msg)
  }

  const phone = profileB.whatsapp.replace(/\D/g, '')

  return (
    <a
      href={canShare ? `https://wa.me/${phone}?text=${buildMsg()}` : undefined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={!canShare ? (e) => e.preventDefault() : undefined}
      title={
        !canShare
          ? hasBlocked
            ? 'Hay escudos mal emparejados — corregí el combobox'
            : 'Completá todos los slots del combobox primero'
          : undefined
      }
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 20,
        letterSpacing: '0.06em',
        background: canShare ? '#25D366' : 'var(--ink-soft)',
        color: 'white',
        textDecoration: 'none',
        border: '2px solid white',
        cursor: canShare ? 'pointer' : 'not-allowed',
        opacity: canShare ? 1 : 0.6,
        transition: 'opacity 0.15s',
      }}
    >
      WhatsApp
    </a>
  )
}
