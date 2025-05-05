'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'
import CrearRestaurante from '@/app/components/CrearRestaurante'

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSessionAndRegister = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('❌ Error obteniendo la sesión:', sessionError.message)
        setIsLoading(false)
        return
      }

      if (!session) {
        router.push('/login')
        return
      }

      const user = session.user

      // Verificar si el usuario ya existe en la tabla 'users'
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error al buscar usuario en tabla users:', fetchError.message)
        setIsLoading(false)
        return
      }

      if (!existingUser) {
        const nombre = user.user_metadata.full_name || user.user_metadata.name || 'Sin nombre'
        const imagen_url = user.user_metadata.picture || ''
        const email = user.email || ''

        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          nombre,
          email,
          imagen_url
          // rol se completa automáticamente como 'cliente'
        })

        if (insertError) {
          console.error('❌ Error al registrar el usuario:', insertError.message)
        } else {
          console.log('✅ Usuario registrado correctamente en tabla users')
        }
      }

      setSession(session)
      setIsLoading(false)
    }

    getSessionAndRegister()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) return null

  const user = session?.user
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Sin nombre'
  const picture = user?.user_metadata?.picture

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 className="text-2xl font-bold my-4">Dashboard</h1>
      <p>Nombre: {name}</p>
      <p>Email: {user?.email}</p>
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

      {/* Componente para crear restaurante */}
      <CrearRestaurante />
    </main>
  )
}
