'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CrearRestaurante() {
  const [nombre, setNombre] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()

  const crearRestaurante = async () => {
    setMensaje('Creando restaurante...')

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      setMensaje('No hay sesión activa')
      return
    }

    const { error } = await supabase.from('restaurantes').insert({
      nombre,
      logo_url: logoUrl,
      owner_id: session.user.id,
    })

    if (error) {
      setMensaje('Error al crear restaurante')
    } else {
      setMensaje('Restaurante creado con éxito')
      router.refresh()
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Nombre del restaurante"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL del logo"
        value={logoUrl}
        onChange={(e) => setLogoUrl(e.target.value)}
      />
      <button onClick={crearRestaurante}>Crear restaurante</button>
      <p>{mensaje}</p>
    </div>
  )
}
