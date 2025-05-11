// orchestrator/router.ts
import 'dotenv/config';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OpenAI } from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AssistantTool {
  type: 'code_interpreter' | 'file_search' | 'function';
  function?: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

interface AssistantMeta {
  role: string;
  model: string;
  promptPath: string;
  tools?: AssistantTool[];
  id?: string;
}

const assistantsPath = path.resolve(__dirname, '..', 'assistants.json');
const assistants: AssistantMeta[] = JSON.parse(readFileSync(assistantsPath, 'utf8'));
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function runAssistant(role: string, prompt: string): Promise<string> {
  const meta = assistants.find((a) => a.role === role);
  if (!meta) throw new Error(`Rol “${role}” no está definido en assistants.json`);

  try {
    // Crear assistant si falta
    if (!meta.id) {
      const promptPath = path.resolve(__dirname, '..', meta.promptPath);
      const instructions = readFileSync(promptPath, 'utf8');

      const assistant = await openai.beta.assistants.create({
        name: `meetgar-${role}`,
        model: meta.model,
        instructions,
        tools: meta.tools?.map((tool) =>
          tool.type === 'function' ? { type: 'function', function: tool.function! } : { type: tool.type }
        ) ?? [],
      });

      meta.id = assistant.id;

      try {
        writeFileSync(assistantsPath, JSON.stringify(assistants, null, 2), 'utf8');
        console.log(`✅ ID del assistant "${role}" guardado en assistants.json`);
      } catch (err) {
        console.error(`❌ No se pudo guardar el assistant_id: ${err}`);
      }
    }

    if (!meta.id) throw new Error(`No se pudo obtener un assistant_id válido para el rol "${role}".`);

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: meta.id,
      temperature: 0.2,
    });

    while (true) {
      const status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (status.status === 'completed') break;
      if (['failed', 'cancelled', 'expired'].includes(status.status)) {
        throw new Error(`❌ Run fallido: ${status.status}`);
      }
      await new Promise((res) => setTimeout(res, 1000));
    }

    const msgs = await openai.beta.threads.messages.list(thread.id, { order: 'desc', limit: 5 });
    const last = msgs.data.find((msg) => msg.role === 'assistant');
    if (!last) {
      console.warn('⚠️ El assistant no devolvió respuesta');
      return '(sin respuesta)';
    }

    const textBlocks = last.content.filter((b) => b.type === 'text') as Array<{
      type: 'text';
      text: { value: string };
    }>;

    return textBlocks.map((b) => b.text.value).join('\n').trim();
  } catch (error: any) {
    console.error(`❌ Error en runAssistant("${role}"): ${error.message}`);
    return '(error de ejecución)';
  }
}

export default runAssistant;
