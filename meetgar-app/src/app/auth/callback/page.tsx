'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleExchange = async () => {
      await supabase.auth.exchangeCodeForSession(window.location.href)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      } else {
        router.replace('/login?error=oauth')
      }
    }

    handleExchange()
  }, [router])

  return <p className="p-4 text-center text-sm">Procesando login...</p>
}
