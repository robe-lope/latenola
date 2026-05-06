import Link from 'next/link'
import { LogoutButton } from './LogoutButton'

export function Header({ userId, userEmail, username }) {
  return (
    <header style={{
      position: 'relative',
      zIndex: 2,
      borderBottom: '2px solid var(--ink)',
      background: 'var(--paper)',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <Link href={userId ? '/album' : '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 34,
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}>
          LateNola{' '}
          <span style={{
            display: 'inline-block',
            transform: 'rotate(-3deg)',
            color: 'var(--accent)',
            fontSize: 16,
            letterSpacing: '0.06em',
            marginLeft: 6,
            verticalAlign: 'middle',
          }}>
            Mundial 2026
          </span>
        </div>
      </Link>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        {userId ? (
          <>
            {username && (
              <Link
                href={`/u/${username}`}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  padding: '4px 10px',
                  border: '1px dashed var(--ink-soft)',
                }}
              >
                /u/{username}
              </Link>
            )}
            <LogoutButton />
          </>
        ) : (
          <Link
            href="/login"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 16,
              letterSpacing: '0.06em',
              color: 'var(--paper)',
              background: 'var(--ink)',
              padding: '6px 14px',
              textDecoration: 'none',
            }}
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}
