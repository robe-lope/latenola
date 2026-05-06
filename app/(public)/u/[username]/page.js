import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CATALOG, CATALOG_BY_ID } from '@/lib/catalog/catalog'
import { Header } from '@/components/ui/Header'
import { PublicProfile } from '@/components/ui/PublicProfile'

export async function generateMetadata({ params }) {
  const { username } = await params
  return {
    title: `${username} — LateNola`,
    description: `Figuritas de ${username} en el álbum Panini Mundial 2026`,
  }
}

export default async function PublicProfilePage({ params }) {
  const { username } = await params
  const supabase = await createClient()

  // Buscar el perfil
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, whatsapp, avatar_emoji, is_public')
    .eq('username', username)
    .single()

  if (error || !profile || !profile.is_public) {
    notFound()
  }

  // Cargar sus stickers
  const { data: userStickers } = await supabase
    .from('user_stickers')
    .select('sticker_id, count')
    .eq('user_id', profile.id)
    .gt('count', 0)

  // Construir mapa de counts con IDs locales
  const counts = {}
  if (userStickers) {
    userStickers.forEach(({ sticker_id, count }) => {
      const localId = sticker_id.startsWith('panini_wc_2026:')
        ? sticker_id.slice('panini_wc_2026:'.length)
        : sticker_id
      counts[localId] = count
    })
  }

  // Calcular stats
  let have = 0, dupes = 0
  CATALOG.forEach((s) => {
    const c = counts[s.id] || 0
    if (c >= 1) have++
    if (c >= 2) dupes += c - 1
  })
  const missing = CATALOG.length - have
  const pct = Math.round((have / CATALOG.length) * 100)

  // Armar listas
  const repes = CATALOG.filter((s) => (counts[s.id] || 0) >= 2)
  const faltan = CATALOG.filter((s) => (counts[s.id] || 0) === 0)

  // Si hay un usuario logueado distinto al perfil, mostrar botón de match
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  let currentUsername = null
  if (currentUser && currentUser.id !== profile.id) {
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', currentUser.id)
      .single()
    currentUsername = currentProfile?.username || null
  }

  return (
    <>
      <Header userId={currentUser?.id} userEmail={currentUser?.email} />
      <PublicProfile
        profile={profile}
        counts={counts}
        stats={{ have, dupes, missing, pct, total: CATALOG.length }}
        repes={repes}
        faltan={faltan}
        matchUsername={currentUsername}
      />
    </>
  )
}
