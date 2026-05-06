import seedData from './seed-2026.json'

function buildCatalog() {
  const stickers = []
  let globalNum = 1

  // Especiales del Mundial (FWC)
  seedData.special_names.forEach((name, i) => {
    let type = 'especial'
    if (i === 0) type = 'trofeo'
    else if (i < 5) type = 'mascota'
    else if (i < 19) type = 'estadio'

    stickers.push({
      id: `FWC-${i + 1}`,
      num: globalNum++,
      code: 'FWC',
      seleccion: 'FWC',
      seleccionName: 'Mundial 2026',
      flag: '🏆',
      group: 'Especiales',
      name,
      type,
      isSpecial: true,
      orderInSet: i + 1,
    })
  })

  // Selecciones
  seedData.selecciones.forEach((sel) => {
    // Escudo
    stickers.push({
      id: `${sel.code}-1`,
      num: globalNum++,
      code: sel.code,
      seleccion: sel.code,
      seleccionName: sel.name,
      flag: sel.flag,
      group: sel.group,
      name: 'Escudo',
      type: 'escudo',
      isSpecial: false,
      orderInSet: 1,
    })

    // Plantel
    stickers.push({
      id: `${sel.code}-2`,
      num: globalNum++,
      code: sel.code,
      seleccion: sel.code,
      seleccionName: sel.name,
      flag: sel.flag,
      group: sel.group,
      name: 'Plantel',
      type: 'plantel',
      isSpecial: false,
      orderInSet: 2,
    })

    // Jugadores
    const players = seedData.players_by_code[sel.code] ||
      Array.from({ length: 18 }, (_, i) => `Jugador ${i + 1}`)

    for (let i = 0; i < 18; i++) {
      stickers.push({
        id: `${sel.code}-${i + 3}`,
        num: globalNum++,
        code: sel.code,
        seleccion: sel.code,
        seleccionName: sel.name,
        flag: sel.flag,
        group: sel.group,
        name: players[i] || `Jugador ${i + 1}`,
        type: 'jugador',
        isSpecial: false,
        orderInSet: i + 3,
      })
    }
  })

  return stickers
}

export const CATALOG = buildCatalog()

// Índice por id para lookup O(1)
export const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((s) => [s.id, s]))

// Grupos únicos de selecciones para filtros
export const GROUPS = ['todas', ...new Set(CATALOG.map((s) => s.group))]

// Selecciones únicas en orden
export const SELECCIONES_LIST = (() => {
  const seen = new Set()
  return CATALOG.filter((s) => {
    if (seen.has(s.code)) return false
    seen.add(s.code)
    return true
  }).map((s) => ({
    code: s.code,
    name: s.seleccionName,
    flag: s.flag,
    group: s.group,
  }))
})()

// Stickers agrupados por selección
export const CATALOG_BY_SELECCION = CATALOG.reduce((acc, s) => {
  if (!acc[s.code]) acc[s.code] = []
  acc[s.code].push(s)
  return acc
}, {})
