import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2 text-red-600">
        ✅ Hola desde el Dashboard
      </h1>
      <p className="text-gray-600 mb-4">
        Sesión activa con: <strong>{user.email}</strong>
      </p>
      <form action="/auth/logout" method="post">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
