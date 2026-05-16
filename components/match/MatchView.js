'use client'

import { useState } from 'react'
import { FixedSideList } from './FixedSideList'
import { ComboboxSide } from './ComboboxSide'
import { WhatsAppShareButton } from './WhatsAppShareButton'

export function MatchView({ profileA, profileB, repesA, repesB }) {
  const [selected, setSelected] = useState([]) // array de N sticker IDs | null (del combobox)
  const [copied, setCopied] = useState(false)

  const N = Math.min(repesA.length, repesB.length)
  const aHasMore = repesA.length > repesB.length
  const equal = repesA.length === repesB.length
  const hasCombobox = !equal && N > 0

  // fixedRepes: las N del lado con menos repes
  // comboRepes: todas las del lado con más (para las opciones del select)
  const fixedRepes = aHasMore ? repesB : repesA
  const comboRepes = aHasMore ? repesA : repesB
  const fixedProfile = aHasMore ? profileB : profileA
  const comboProfile = aHasMore ? profileA : profileB

  // ¿El lado combobox tiene algún escudo para poder matchear escudos del fijo?
  const comboHasShields = comboRepes.some((r) => r.sticker.type === 'escudo')

  // Calcular si alguna fila seleccionada tiene type mismatch (escudo vs no-escudo)
  function checkBlocked(selArray) {
    return selArray.some((stickerId, i) => {
      if (!stickerId) return false
      const fixedType = fixedRepes[i]?.sticker.type ?? null
      const selectedSticker = comboRepes.find((r) => r.sticker.id === stickerId)
      const selectedType = selectedSticker?.sticker.type ?? null
      if (!fixedType || !selectedType) return false
      return (fixedType === 'escudo') !== (selectedType === 'escudo')
    })
  }

  const allSelected = hasCombobox && selected.length === N && selected.every(Boolean)
  const hasBlocked = hasCombobox ? checkBlocked(selected) : false

  // Construir las listas finales que van al mensaje de WhatsApp
  const comboOfferedRepes = hasCombobox
    ? selected.filter(Boolean).map((id) => comboRepes.find((r) => r.sticker.id === id)).filter(Boolean)
    : comboRepes.slice(0, N)

  const aOfferedRepes = aHasMore ? comboOfferedRepes : repesA.slice(0, N)
  const bOfferedRepes = aHasMore ? repesB.slice(0, N) : comboOfferedRepes

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const nameA = profileA.display_name || profileA.username
  const nameB = profileB.display_name || profileB.username

  return (
    <main style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
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
            {nameA}
            <span style={{ color: 'var(--accent)', margin: '0 12px' }}>VS</span>
            {nameB}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: 'rgba(244,237,224,0.6)',
            marginTop: 4,
          }}>
            {N > 0
              ? `Match parejo: ${N} figurita${N !== 1 ? 's' : ''} de cada lado`
              : 'Ninguno tiene repes todavía'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyLink}
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

          <WhatsAppShareButton
            profileA={profileA}
            profileB={profileB}
            aRepes={aOfferedRepes}
            bRepes={bOfferedRepes}
            hasCombobox={hasCombobox}
            allSelected={allSelected}
            hasBlocked={hasBlocked}
          />
        </div>
      </div>

      {/* Estado vacío */}
      {N === 0 && (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          fontFamily: "'Fraunces', serif",
          fontSize: 18,
          color: 'var(--ink-soft)',
          lineHeight: 1.6,
        }}>
          {repesA.length === 0 && repesB.length === 0
            ? 'Ninguno tiene figuritas repetidas todavía.'
            : repesA.length === 0
            ? `${nameA} no tiene repes todavía.`
            : `${nameB} no tiene repes todavía.`}
          <br />
          <span style={{ fontSize: 14 }}>Carguen más en sus álbumes y vuelvan a ver el match.</span>
        </div>
      )}

      {/* Aviso: combobox incompleto */}
      {hasCombobox && !allSelected && N > 0 && (
        <div style={{
          marginBottom: 16,
          padding: '10px 14px',
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          background: 'var(--paper-dark)',
          border: '1px dashed var(--ink-soft)',
          color: 'var(--ink-soft)',
        }}>
          {comboProfile.display_name || comboProfile.username} tiene más repes —
          elegí {N} figuritas para desbloquear el WhatsApp.
        </div>
      )}

      {/* Match con combobox (un lado tiene más repes) */}
      {hasCombobox && N > 0 && (
        <div className="match-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {aHasMore ? (
            <>
              <ComboboxSide
                profile={comboProfile}
                repes={comboRepes}
                N={N}
                fixedRepes={fixedRepes}
                color="var(--have)"
                onChange={setSelected}
              />
              <FixedSideList
                profile={fixedProfile}
                repes={fixedRepes}
                color="var(--dupe)"
                counterpartHasShields={comboHasShields}
              />
            </>
          ) : (
            <>
              <FixedSideList
                profile={fixedProfile}
                repes={fixedRepes}
                color="var(--have)"
                counterpartHasShields={comboHasShields}
              />
              <ComboboxSide
                profile={comboProfile}
                repes={comboRepes}
                N={N}
                fixedRepes={fixedRepes}
                color="var(--dupe)"
                onChange={setSelected}
              />
            </>
          )}
        </div>
      )}

      {/* Match parejo: igual cantidad de repes, dos listas fijas */}
      {equal && N > 0 && (
        <div className="match-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <FixedSideList
            profile={profileA}
            repes={repesA}
            color="var(--have)"
            counterpartHasShields={null}
          />
          <FixedSideList
            profile={profileB}
            repes={repesB}
            color="var(--dupe)"
            counterpartHasShields={null}
          />
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .match-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
