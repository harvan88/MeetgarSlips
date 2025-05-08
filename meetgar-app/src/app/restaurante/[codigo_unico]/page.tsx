import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Esta línea intercambia el código de OAuth por una sesión válida
  await supabase.auth.exchangeCodeForSession(request.url)

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
