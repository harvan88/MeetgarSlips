// crearEstructura.ts
import fs from 'fs'
import path from 'path'

const base = path.resolve(__dirname, 'asistente-ia')

const carpetas = [
  'asistentes',
  'contexto',
  'prompts',
  'hilos/ui',
  'historial/ui',
  'mantenimiento',
  'utils',
  'logs'
]

for (const carpeta of carpetas) {
  const ruta = path.join(base, carpeta)
  if (!fs.existsSync(ruta)) {
    fs.mkdirSync(ruta, { recursive: true })
    console.log(`📁 creada: ${ruta}`)
  } else {
    console.log(`✅ existe: ${ruta}`)
  }
}

const archivosIniciales = [
  ['.env', 'OPENAI_API_KEY=\nASST_UI_ID=\n'],
  ['prompts/ui.prompt.txt', 'Sos un experto en frontend mobile-first con Next.js 14 (App Router), TailwindCSS y Supabase.'],
  ['contexto/README.txt', 'Aquí podés guardar archivos como database.types.ts, o cualquier entrada que se use como contexto para IA.']
]

for (const [archivoRel, contenido] of archivosIniciales) {
  const ruta = path.join(base, archivoRel)
  if (!fs.existsSync(ruta)) {
    fs.writeFileSync(ruta, contenido)
    console.log(`📝 creado: ${ruta}`)
  } else {
    console.log(`✏️ existe: ${ruta}`)
  }
}
