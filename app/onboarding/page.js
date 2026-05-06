'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [username, setUsername] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [checkingUser, setCheckingUser] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      // Pre-llenar username con parte del email
      const emailPrefix = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
      setUsername(emailPrefix)
      setCheckingUser(false)
    }
    init()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const cleaned = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (cleaned.length < 3) {
      setError('El usuario tiene que tener al menos 3 caracteres (letras, números, _)')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: cleaned,
        display_name: cleaned,
        whatsapp: whatsapp.trim() || null,
      })

    if (error) {
      if (error.code === '23505') {
        setError('Ese usuario ya está tomado, probá con otro.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    router.replace('/album')
  }

  if (checkingUser) return null

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'var(--paper)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 42,
          letterSpacing: '0.04em',
        }}>
          LateNola
        </div>
        <p style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 16,
          color: 'var(--ink-soft)',
          marginTop: 8,
        }}>
          Último paso antes de entrar al álbum
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--paper)',
        border: '2px solid var(--ink)',
        boxShadow: '6px 6px 0 var(--ink)',
        padding: '32px 28px',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 22,
          letterSpacing: '0.04em',
          marginBottom: 24,
        }}>
          Elegí tu usuario
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Username */}
          <div>
            <label style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-soft)',
              display: 'block',
              marginBottom: 6,
            }}>
              Usuario público *
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: "'DM Mono', monospace",
                fontSize: 15,
                color: 'var(--ink-soft)',
              }}>
                /u/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="robe"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 15,
                  background: 'var(--paper-dark)',
                  border: '1.5px solid var(--ink)',
                  outline: 'none',
                  color: 'var(--ink)',
                }}
              />
            </div>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: 'var(--ink-soft)',
              marginTop: 6,
            }}>
              Este es el link que compartís con tus amigos. Solo letras, números y _.
            </p>
          </div>

          {/* WhatsApp */}
          <div>
            <label style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-soft)',
              display: 'block',
              marginBottom: 6,
            }}>
              WhatsApp (opcional)
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+5491145678901"
              style={{
                width: '100%',
                padding: '12px 14px',
                fontFamily: "'DM Mono', monospace",
                fontSize: 15,
                background: 'var(--paper-dark)',
                border: '1.5px solid var(--ink)',
                outline: 'none',
                color: 'var(--ink)',
              }}
            />
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: 'var(--ink-soft)',
              marginTop: 6,
            }}>
              Para que tus amigos te contacten directo cuando hay match.
            </p>
          </div>

          {error && (
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: 'var(--accent)',
              padding: '8px 12px',
              background: 'rgba(214,40,40,0.08)',
              border: '1px solid var(--accent)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 20,
              letterSpacing: '0.06em',
              background: loading ? 'var(--ink-soft)' : 'var(--accent)',
              color: 'var(--paper)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}
          >
            {loading ? 'Guardando...' : '¡A pegar figuritas!'}
          </button>
        </form>
      </div>
    </div>
  )
}
