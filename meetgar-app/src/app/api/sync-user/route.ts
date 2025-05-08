import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function POST() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'No se pudo obtener el usuario' }, { status: 401 })
    }

    const { id, email, user_metadata } = user
    const nombre = user_metadata?.full_name || user_metadata?.name || 'Sin Nombre'
    const imagen_url = user_metadata?.avatar_url || null

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: 'Error consultando usuario' }, { status: 500 })
    }

    if (!existingUser) {
      const { error: insertError } = await supabase.from('users').insert({
        id,
        email,
        nombre,
        imagen_url,
        rol: 'cliente',
      })

      if (insertError) {
        return NextResponse.json({ error: 'Error creando usuario' }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Error inesperado en /api/sync-user:', error)
    return NextResponse.json({ error: 'Error inesperado del servidor' }, { status: 500 })
  }
}
