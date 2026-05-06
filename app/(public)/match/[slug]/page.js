import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CATALOG } from '@/lib/catalog/catalog'
import { Header } from '@/components/ui/Header'
import { MatchView } from '@/components/match/MatchView'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const [a, b] = slug.split('-vs-')
  return {
    title: `${a} vs ${b} — Match LateNola`,
    description: `Cruce de figuritas entre ${a} y ${b} para el Panini Mundial 2026`,
  }
}

export default async function MatchPage({ params }) {
  const { slug } = await params
  const parts = slug.split('-vs-')
  if (parts.length !== 2) notFound()

  const [usernameA, usernameB] = parts
  const supabase = await createClient()

  // Buscar ambos perfiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, display_name, whatsapp, avatar_emoji, is_public')
    .in('username', [usernameA, usernameB])

  if (!profiles || profiles.length < 2) notFound()

  const profileA = profiles.find((p) => p.username === usernameA)
  const profileB = profiles.find((p) => p.username === usernameB)

  if (!profileA || !profileB || !profileA.is_public || !profileB.is_public) notFound()

  // Cargar stickers de ambos
  const { data: allUserStickers } = await supabase
    .from('user_stickers')
    .select('user_id, sticker_id, count')
    .in('user_id', [profileA.id, profileB.id])
    .gt('count', 0)

  function buildCounts(userId) {
    const map = {}
    if (!allUserStickers) return map
    allUserStickers
      .filter((us) => us.user_id === userId)
      .forEach(({ sticker_id, count }) => {
        const localId = sticker_id.startsWith('panini_wc_2026:')
          ? sticker_id.slice('panini_wc_2026:'.length)
          : sticker_id
        map[localId] = count
      })
    return map
  }

  const countsA = buildCounts(profileA.id)
  const countsB = buildCounts(profileB.id)

  // Calcular matches
  const yoDoy = [] // A tiene repe, B no tiene
  const elDa = []  // B tiene repe, A no tiene

  CATALOG.forEach((s) => {
    const cA = countsA[s.id] || 0
    const cB = countsB[s.id] || 0
    if (cA >= 2 && cB === 0) yoDoy.push({ sticker: s, count: cA - 1 })
    if (cB >= 2 && cA === 0) elDa.push({ sticker: s, count: cB - 1 })
  })

  return (
    <>
      <Header />
      <MatchView
        profileA={profileA}
        profileB={profileB}
        yoDoy={yoDoy}
        elDa={elDa}
      />
    </>
  )
}
