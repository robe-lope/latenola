'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

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
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 52,
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}>
          LateNola
        </div>
        <div style={{
          display: 'inline-block',
          transform: 'rotate(-3deg)',
          color: 'var(--accent)',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20,
          letterSpacing: '0.06em',
          marginTop: 4,
        }}>
          Mundial 2026
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--paper)',
        border: '2px solid var(--ink)',
        boxShadow: '6px 6px 0 var(--ink)',
        padding: '32px 28px',
      }}>
        {!sent ? (
          <>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 24,
              letterSpacing: '0.04em',
              marginBottom: 8,
            }}>
              Entrá al álbum
            </h2>
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              color: 'var(--ink-soft)',
              marginBottom: 24,
              lineHeight: 1.5,
            }}>
              Te mandamos un link mágico al mail. Sin contraseña, sin drama.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@gmail.com"
                required
                autoFocus
                style={{
                  padding: '12px 14px',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 15,
                  background: 'var(--paper-dark)',
                  border: '1.5px solid var(--ink)',
                  outline: 'none',
                  color: 'var(--ink)',
                  width: '100%',
                }}
              />

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
                  background: loading ? 'var(--ink-soft)' : 'var(--ink)',
                  color: 'var(--paper)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Enviando...' : 'Mandarme el link'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 24,
              letterSpacing: '0.04em',
              marginBottom: 12,
            }}>
              ¡Link enviado!
            </h2>
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              color: 'var(--ink-soft)',
              lineHeight: 1.6,
            }}>
              Revisá tu mail en <strong>{email}</strong> y hacé click en el link para entrar.
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              style={{
                marginTop: 24,
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                color: 'var(--ink-soft)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Usar otro mail
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
