// asistente-ia/orchestrator/router.ts
import { readFileSync, writeFileSync } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OpenAI } from 'openai';
import assistantsJson from '../assistants.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AssistantMeta {
  role: string;
  model: string;
  promptPath: string;
  tools?: OpenAI.Beta.Assistants.AssistantTool[];
  id?: string;
}

const assistants = assistantsJson as AssistantMeta[];
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function loadPrompt(relPath: string): string {
  return readFileSync(path.resolve(__dirname, '..', relPath), 'utf8');
}

function saveAssistants() {
  const outPath = path.resolve(__dirname, '..', 'assistants.json');
  writeFileSync(outPath, JSON.stringify(assistants, null, 2), 'utf8');
}

export async function runAssistant(role: string, prompt: string): Promise<string> {
  const meta = assistants.find((a) => a.role === role);
  if (!meta) throw new Error(`Rol “${role}” no existe en assistants.json`);

  // Crear assistant si no existe
  if (!meta.id) {
    const assistant = await openai.beta.assistants.create({
      name: `meetgar-${role}`,
      model: meta.model,
      instructions: loadPrompt(meta.promptPath),
      ...(meta.tools?.length ? { tools: meta.tools } : {}),
    });
    meta.id = assistant.id;
    saveAssistants();
  }

  // Crear thread vacío
  const thread = await openai.beta.threads.create();

  // Agregar mensaje del usuario
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: prompt,
  });

  // Ejecutar el assistant en el thread
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: meta.id!,
    temperature: 0.2,
  });

  // Poll hasta que se complete
  while (true) {
    const current = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    if (current.status === 'completed') break;
    if (['failed', 'cancelled', 'expired'].includes(current.status)) {
      throw new Error(`Run terminó con estado: ${current.status}`);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Obtener último mensaje del assistant (ordenado)
  const msgs = await openai.beta.threads.messages.list(thread.id, {
    order: 'desc',
    limit: 10,
  });


const last = msgs.data.find((msg) => msg.role === 'assistant');
if (!last) return '';

type TextBlock = Extract<
  OpenAI.Beta.Threads.Messages.MessageContent,
  { type: 'text' }
>;

const textBlocks = last.content.filter(
  (block): block is TextBlock => block.type === 'text'
);

return textBlocks.map((b) => b.text.value).join('\n').trim();


  return textBlocks.map((b) => b.text.value).join('\n').trim();
}

// Export default
export default runAssistant;
