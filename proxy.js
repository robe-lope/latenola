import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Valida que las credenciales sean URLs reales (no placeholders)
function hasValidCredentials() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) return false
    new URL(SUPABASE_URL)
    return SUPABASE_URL.startsWith('http')
  } catch {
    return false
  }
}

export async function proxy(request) {
  // Sin credenciales válidas (ej. en dev sin .env configurado), dejar pasar todo
  if (!hasValidCredentials()) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas protegidas — requieren auth
  const protectedPaths = ['/album', '/repes', '/faltan', '/perfil']
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  )

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Admin — solo robelopee@gmail.com
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.email !== 'robelopee@gmail.com') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
