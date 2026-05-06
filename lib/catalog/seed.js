/**
 * Script de seed: inserta el catálogo completo en Supabase.
 * Correr con: node lib/catalog/seed.js
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   ← Supabase → Settings → API → service_role
 *
 * Usa la service role key porque la RLS bloquea inserts con el anon key.
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../../.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey || serviceKey === 'your-service-role-key-here') {
  console.error('ERROR: Falta SUPABASE_SERVICE_ROLE_KEY en .env.local')
  console.error('Conseguila en Supabase → Settings → API → service_role')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const seedData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'seed-2026.json'), 'utf-8')
)

function buildStickers() {
  const stickers = []
  let globalNum = 1

  // Especiales FWC
  seedData.special_names.forEach((name, i) => {
    let type = 'especial'
    if (i === 0) type = 'trofeo'
    else if (i < 5) type = 'mascota'
    else if (i < 19) type = 'estadio'

    stickers.push({
      id: `panini_wc_2026:FWC-${i + 1}`,
      edition_id: 'panini_wc_2026',
      team_code: 'FWC',
      team_name: 'Mundial 2026',
      team_flag: '🏆',
      team_group: 'Especiales',
      order_in_team: i + 1,
      global_number: globalNum++,
      name,
      type,
      is_special: true,
    })
  })

  // Selecciones
  seedData.selecciones.forEach((sel) => {
    // Escudo
    stickers.push({
      id: `panini_wc_2026:${sel.code}-1`,
      edition_id: 'panini_wc_2026',
      team_code: sel.code,
      team_name: sel.name,
      team_flag: sel.flag,
      team_group: sel.group,
      order_in_team: 1,
      global_number: globalNum++,
      name: 'Escudo',
      type: 'escudo',
      is_special: false,
    })

    // Plantel
    stickers.push({
      id: `panini_wc_2026:${sel.code}-2`,
      edition_id: 'panini_wc_2026',
      team_code: sel.code,
      team_name: sel.name,
      team_flag: sel.flag,
      team_group: sel.group,
      order_in_team: 2,
      global_number: globalNum++,
      name: 'Plantel',
      type: 'plantel',
      is_special: false,
    })

    // Jugadores
    const players =
      seedData.players_by_code[sel.code] ||
      Array.from({ length: 18 }, (_, i) => `Jugador ${i + 1}`)

    for (let i = 0; i < 18; i++) {
      stickers.push({
        id: `panini_wc_2026:${sel.code}-${i + 3}`,
        edition_id: 'panini_wc_2026',
        team_code: sel.code,
        team_name: sel.name,
        team_flag: sel.flag,
        team_group: sel.group,
        order_in_team: i + 3,
        global_number: globalNum++,
        name: players[i] || `Jugador ${i + 1}`,
        type: 'jugador',
        is_special: false,
      })
    }
  })

  return stickers
}

async function seed() {
  console.log('Seeding edición...')
  const { error: edError } = await supabase.from('editions').upsert({
    id: 'panini_wc_2026',
    name: 'Panini Mundial 2026',
    total_stickers: 980,
    is_active: true,
  })
  if (edError) {
    console.error('Error edición:', edError)
    process.exit(1)
  }

  const stickers = buildStickers()
  console.log(`Inserting ${stickers.length} stickers...`)

  // Insertar en lotes de 100
  const BATCH = 100
  for (let i = 0; i < stickers.length; i += BATCH) {
    const batch = stickers.slice(i, i + BATCH)
    const { error } = await supabase.from('stickers').upsert(batch)
    if (error) {
      console.error(`Error en batch ${i}-${i + BATCH}:`, error)
      process.exit(1)
    }
    console.log(`  ${Math.min(i + BATCH, stickers.length)}/${stickers.length}`)
  }

  console.log('Seed completo!')
}

seed()
