/**
 * Jala los nombres de jugadores desde Supabase y actualiza players_by_code en seed-2026.json.
 * Correr con: node lib/catalog/pull-players.js
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../../.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('ERROR: Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const seedPath = path.join(__dirname, 'seed-2026.json')

async function pull() {
  console.log('Jalando jugadores desde Supabase...')

  const { data, error } = await supabase
    .from('stickers')
    .select('team_code, name, order_in_team')
    .eq('edition_id', 'panini_wc_2026')
    .eq('type', 'jugador')
    .order('team_code')
    .order('order_in_team')

  if (error) {
    console.error('Error:', error)
    process.exit(1)
  }

  // Agrupar por team_code, ordenados por order_in_team
  const byCode = {}
  data.forEach(({ team_code, name, order_in_team }) => {
    if (!byCode[team_code]) byCode[team_code] = []
    byCode[team_code].push({ name, order_in_team })
  })

  // Convertir a arrays de nombres ordenados
  const players_by_code = {}
  Object.entries(byCode).forEach(([code, players]) => {
    players.sort((a, b) => a.order_in_team - b.order_in_team)
    players_by_code[code] = players.map((p) => p.name)
  })

  // Actualizar seed-2026.json
  const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))
  seed.players_by_code = players_by_code
  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf-8')

  const countries = Object.keys(players_by_code).length
  const total = Object.values(players_by_code).reduce((s, p) => s + p.length, 0)
  console.log(`Listo: ${countries} selecciones, ${total} jugadores guardados en seed-2026.json`)
  console.log('Países:', Object.keys(players_by_code).join(', '))
}

pull()
