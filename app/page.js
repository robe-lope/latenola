import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/ui/Header'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si ya está logueado, ir directo al álbum
  if (user) redirect('/album')

  return (
    <>
      <Header />
      <main style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 72,
            letterSpacing: '0.04em',
            lineHeight: 0.9,
          }}>
            LateNola
          </div>
          <div style={{
            display: 'inline-block',
            transform: 'rotate(-3deg)',
            color: 'var(--accent)',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28,
            letterSpacing: '0.06em',
            marginBottom: 32,
          }}>
            Mundial 2026
          </div>

          <p style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 18,
            lineHeight: 1.6,
            color: 'var(--ink-soft)',
            marginBottom: 40,
          }}>
            Seguí tus figuritas Panini, registrá tus repetidas, y encontrá con quién intercambiar entre tus amigos.
          </p>

          <Link
            href="/login"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 24,
              letterSpacing: '0.08em',
              background: 'var(--ink)',
              color: 'var(--paper)',
              textDecoration: 'none',
              boxShadow: '4px 4px 0 var(--accent)',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
          >
            Empezar
          </Link>

          <div style={{
            marginTop: 48,
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {[
              { emoji: '⚽', text: '980 figuritas del álbum oficial' },
              { emoji: '🔄', text: 'Cruzá repes con tus amigos' },
              { emoji: '📱', text: 'Mobile-first, sin app que instalar' },
            ].map(({ emoji, text }) => (
              <div key={text} style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 14,
                color: 'var(--ink-soft)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span>{emoji}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
