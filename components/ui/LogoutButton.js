'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--ink-soft)',
        background: 'none',
        border: '1px solid var(--ink-soft)',
        padding: '4px 10px',
        cursor: 'pointer',
      }}
    >
      Salir
    </button>
  )
}
