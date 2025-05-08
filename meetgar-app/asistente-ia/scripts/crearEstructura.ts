// asistente-ia/crearEstructura.ts
import path from 'path'
import { crearCarpetasBase } from '../utils/crearCarpetas.ts'
import { crearArchivosBase } from '../utils/crearArchivosBase.ts'

const baseDir = path.resolve(__dirname, '..')

console.log('🚀 Iniciando estructura avanzada de asistentes...\n')

crearCarpetasBase(baseDir)
crearArchivosBase(baseDir)

console.log('\n✅ Estructura completa lista para usar.')
