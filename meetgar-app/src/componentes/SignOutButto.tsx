'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export default function BotonCerrarSesion() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const cerrarSesion = async () => {
    // Cierra sesión en Supabase
    await supabase.auth.signOut()

    // Limpieza de storage para evitar errores en el próximo login
    localStorage.removeItem('supabase.auth.token')
    localStorage.removeItem('supabase.auth._state')
    localStorage.clear()

    // Redirige al login
    router.push('/login')
  }

  return (
    <button
      onClick={cerrarSesion}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Cerrar sesión
    </button>
  )
}
