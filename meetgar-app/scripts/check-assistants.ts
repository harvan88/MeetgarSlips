import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { z } from 'zod';

/* ─ Esquemas válidos de la API ─ */
const Tool = z.union([
  z.object({ type: z.literal('code_interpreter') }),
  z.object({ type: z.literal('file_search') }),
  z.object({
    type: z.literal('function'),
    function: z.object({
      name: z.string(),
      description: z.string().optional(),
      parameters: z.any()
    })
  })
]);

const Assistant = z.object({
  role: z.string(),
  model: z.enum(['gpt-3.5-turbo', 'gpt-4o-mini', 'gpt-4o']),
  promptPath: z.string(),
  tools: z.array(Tool)
});

const AssistantsFile = z.array(Assistant);

/* ─ Validación ─ */
try {
  const raw = readFileSync('asistente-ia/assistants.json', 'utf8');
  const data = AssistantsFile.parse(JSON.parse(raw));

  data.forEach(({ role, promptPath }) => {
    const full = path.resolve('asistente-ia', promptPath);
    if (!existsSync(full)) throw new Error(`Prompt faltante en ${role}: ${full}`);
  });

  console.log('✅ assistants.json y rutas de prompt validados');
  process.exit(0);
} catch (e) {
  console.error('🚨', (e as Error).message);
  process.exit(1);
}
