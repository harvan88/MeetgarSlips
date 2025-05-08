// asistente-ia/crearCarpetas.ts
import fs from 'fs'
import path from 'path'

export function crearCarpetasBase(baseDir: string = 'asistente-ia') {
  const asistentes = ['ui', 'bd', 'test', 'docs', 'orquestador']

  asistentes.forEach((nombre) => {
    const carpetas = [
      '',
      'hilos',
      'historial',
      'logs',
      'mantenimiento',
      'prompts',
      'contexto'
    ]

    carpetas.forEach((sub) => {
      const fullPath = path.join(baseDir, nombre, sub)
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
        console.log(`📁 creada: ${fullPath}`)
      }
    })

    // Crear README en contexto
    const readmePath = path.join(baseDir, nombre, 'contexto', 'README.txt')
    if (!fs.existsSync(readmePath)) {
      fs.writeFileSync(readmePath, `Archivos fuente para el asistente "${nombre}".`)
      console.log(`📝 creado: ${readmePath}`)
    }

    // Crear archivo de ID del assistant
    const idPath = path.join(baseDir, nombre, 'prompts', 'asst.id')
    if (!fs.existsSync(idPath)) {
      fs.writeFileSync(idPath, `asst_`) // el ID real lo completás vos
      console.log(`🧾 creado: ${idPath}`)
    }
  })
}
