import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { OpenAI } from "openai";

config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function runAssistant(role: string, mensaje: string) {
  const basePath = path.join("asistente-ia", "roles", role);
  const assistantIdPath = path.join(basePath, "assistant_id.txt");
  const threadPath = path.join(basePath, "thread_id.txt");

  if (!fs.existsSync(assistantIdPath)) {
    throw new Error(`No se encontró assistant_id para ${role}`);
  }

  const assistant_id = fs.readFileSync(assistantIdPath, "utf-8").trim();

  let threadId: string;
  if (fs.existsSync(threadPath)) {
    threadId = fs.readFileSync(threadPath, "utf-8").trim();
  } else {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
    fs.writeFileSync(threadPath, threadId);
  }

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: mensaje,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id,
  });

  process.stdout.write(`⏳ ${role} está pensando...\n`);

  while (true) {
    const status = await openai.beta.threads.runs.retrieve(threadId, run.id);
    if (status.status === "completed") break;
    if (status.status === "failed") throw new Error("❌ Falló el asistente.");
    await new Promise(r => setTimeout(r, 1000));
  }

  const messages = await openai.beta.threads.messages.list(threadId);
  const assistantMessage = messages.data.find(m => m.role === "assistant");
  const textBlock = assistantMessage?.content.find(c => c.type === "text");
  const respuesta = textBlock && "text" in textBlock ? textBlock.text.value : "(sin respuesta)";
  console.log(`💬 ${role}: ${respuesta}`);
}

if (require.main === module) {
  const [, , role, ...mensaje] = process.argv;
  if (!role || mensaje.length === 0) {
    console.error("Uso: pnpm tsx asistente-ia/orchestrator/router.ts <role> \"mensaje\"");
    process.exit(1);
  }

  runAssistant(role, mensaje.join(" ")).catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
  });
}
