import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const body = await req.json()

    const { latitud, longitud, restaurante_id } = body

    if (!latitud || !longitud || !restaurante_id) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user_id = user.id

    const { error: upsertError } = await supabase.from('ubicaciones').upsert(
      {
        user_id,
        latitud,
        longitud,
        restaurante_id,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: 'user_id' } // Actualiza si ya existe
    )

    if (upsertError) {
      console.error('❌ Error guardando ubicación:', upsertError)
      return NextResponse.json({ error: 'Error guardando ubicación' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Error inesperado en /api/set-ubicacion:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
