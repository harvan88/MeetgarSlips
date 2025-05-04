'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }

    getSession()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!session) return null

  const user = session.user
  const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Sin nombre'
  const picture = user.user_metadata?.picture

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Bienvenido al Dashboard</h1>
      <p>Nombre: {name}</p>
      <p>Email: {user.email}</p>
      {picture && (
        <img
          src={picture}
          alt="Foto de perfil"
          width={80}
          height={80}
          style={{ borderRadius: '50%', marginTop: '1rem' }}
        />
      )}
      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Cerrar sesión
      </button>
    </main>
  )
}
