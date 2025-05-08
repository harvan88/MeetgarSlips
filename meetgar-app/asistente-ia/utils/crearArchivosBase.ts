// asistente-ia/crearArchivosBase.ts
import fs from 'fs'
import path from 'path'

export function crearArchivosBase(baseDir: string = 'asistente-ia') {
  const archivos: [string, string][] = [
    ['.env', 'OPENAI_API_KEY=\n']
  ]

  archivos.forEach(([relPath, contenido]) => {
    const fullPath = path.join(baseDir, relPath)
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, contenido)
      console.log(`📝 creado: ${fullPath}`)
    }
  })
}
