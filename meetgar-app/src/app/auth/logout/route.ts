import { createSupabaseServerActionClient } from '@/lib/supabase/serverAction'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerActionClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/login', request.url))
}
