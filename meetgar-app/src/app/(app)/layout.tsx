'use client'

import { useEffect } from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Meetgar App',
  description: 'Zona privada de la app',
}

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const restauranteId =
    typeof window !== 'undefined' ? localStorage.getItem('restaurante_id') : null

  useEffect(() => {
    const sync = async () => {
      try {
        await fetch('/api/sync-user', { method: 'POST' })

        if (!restauranteId) {
          console.warn('⚠️ restauranteId no está definido en localStorage')
          return
        }

        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords

            await fetch('/api/set-ubicacion', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                latitud: latitude,
                longitud: longitude,
                restaurante_id: restauranteId,
              }),
            })
          })
        } else {
          console.warn('⚠️ El navegador no soporta geolocalización')
        }
      } catch (error) {
        console.error('❌ Error en sincronización o geolocalización:', error)
      }
    }

    void sync()
  }, [restauranteId])

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
