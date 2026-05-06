'use client'

import { CATALOG_BY_SELECCION, SELECCIONES_LIST } from '@/lib/catalog/catalog'
import { SeleccionCard } from './SeleccionCard'

export function DesktopAlbumView({ getCount, onAdjust, filter }) {
  const selecciones = filter === 'todas'
    ? SELECCIONES_LIST
    : SELECCIONES_LIST.filter((s) => s.group === filter)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 18,
    }}>
      {selecciones.map((sel) => (
        <SeleccionCard
          key={sel.code}
          seleccion={sel}
          stickers={CATALOG_BY_SELECCION[sel.code] || []}
          getCount={getCount}
          onAdjust={onAdjust}
        />
      ))}
    </div>
  )
}
