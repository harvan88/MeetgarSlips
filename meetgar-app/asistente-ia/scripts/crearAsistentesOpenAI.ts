import fs from 'fs'
import path from 'path'
import { OpenAI } from 'openai'
import * as dotenv from 'dotenv'

// Asegura que se cargue el .env desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Validar que la API Key esté presente
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
  console.error('❌ ERROR: Falta la variable OPENAI_API_KEY en el archivo .env')
  process.exit(1)
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const baseDir = path.resolve(__dirname, '..')
const asistentes = ['ui', 'bd', 'test', 'docs', 'orquestador']

async function crearAsistente(nombre: string, prompt: string): Promise<string> {
  const assistant = await openai.beta.assistants.create({
    name: `dev-meetgar-${nombre}`,
    instructions: prompt,
    model: 'gpt-4-turbo',
    tools: [{ type: 'code_interpreter' }]
  })

  return assistant.id
}

async function main() {
  for (const nombre of asistentes) {
    const carpeta = path.join(baseDir, nombre)
    const promptPath = path.join(carpeta, 'prompts', 'prompt.txt')
    const idPath = path.join(carpeta, 'prompts', 'asst.id')

    // Validar si ya existe un ID no vacío
    if (fs.existsSync(idPath)) {
      const contenido = fs.readFileSync(idPath, 'utf-8').trim()
      if (contenido.length > 10) {
        console.log(`⚠️  ${nombre}: ya existe un ID válido en ${idPath}, omitiendo...`)
        continue
      }
    }

    // Cargar prompt o usar uno por defecto
    let prompt = `Sos un asistente experto en ${nombre} del sistema Meetgar Slips.`
    if (fs.existsSync(promptPath)) {
      prompt = fs.readFileSync(promptPath, 'utf-8')
    }

    console.log(`🚀 Creando asistente para: ${nombre}`)
    const id = await crearAsistente(nombre, prompt)

    fs.writeFileSync(idPath, id)
    console.log(`✅ ${nombre}: ID guardado en prompts/asst.id → ${id}\n`)
  }
}

main().catch((err) => {
  console.error('❌ Error inesperado al crear asistentes:\n', err)
  process.exit(1)
})
