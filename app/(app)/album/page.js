import { createClient } from '@/lib/supabase/server'
import { AlbumView } from '@/components/album/AlbumView'

export default async function AlbumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <AlbumView userId={user.id} />
}
