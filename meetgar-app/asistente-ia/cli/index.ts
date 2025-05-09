import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { OpenAI } from "openai";

config();
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("❌ Falta OPENAI_API_KEY en el entorno.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

async function main() {
  const [, , comando, role, ...mensaje] = process.argv;

  if (comando !== "chat" || !role || mensaje.length === 0) {
    console.error("Uso: pnpm tsx asistente-ia/cli/index.ts chat <role> \"mensaje\"");
    process.exit(1);
  }

  const userMessage = mensaje.join(" ");
  const basePath = path.join("asistente-ia", "roles", role);
  const assistantIdPath = path.join(basePath, "assistant_id.txt");
  const threadPath = path.join(basePath, "thread_id.txt");

  if (!fs.existsSync(assistantIdPath)) {
    console.error(`❌ No se encontró assistant_id para ${role}`);
    process.exit(1);
  }

  const assistantId = fs.readFileSync(assistantIdPath, "utf-8").trim();
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
    content: userMessage,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  process.stdout.write(`⏳ ${role} está pensando...\n`);

  while (true) {
    const status = await openai.beta.threads.runs.retrieve(threadId, run.id);
    if (status.status === "completed") break;
    if (status.status === "failed") {
      console.error("❌ El asistente falló.");
      process.exit(1);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  const messages = await openai.beta.threads.messages.list(threadId);
  const assistantMessage = messages.data.find(m => m.role === "assistant");
  const textBlock = assistantMessage?.content.find(c => c.type === "text");
  const respuesta = textBlock && "text" in textBlock ? textBlock.text.value : "(sin respuesta)";
  console.log(`💬 ${role}: ${respuesta}`);
}

main().catch(err => {
  console.error("❌ Error en CLI:", err);
  process.exit(1);
});
