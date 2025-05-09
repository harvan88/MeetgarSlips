import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { OpenAI } from "openai";

// Cargar claves de entorno
config();
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("❌ Falta OPENAI_API_KEY en .env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });
const assistantsPath = path.resolve("asistente-ia/assistants.json");

if (!fs.existsSync(assistantsPath)) {
  console.error("❌ No se encontró assistants.json");
  process.exit(1);
}

let assistants: any[];
try {
  assistants = JSON.parse(fs.readFileSync(assistantsPath, "utf-8"));
} catch (err) {
  console.error("❌ Error al leer el JSON:", err);
  process.exit(1);
}

async function registrarAsistentes() {
  for (const asistente of assistants) {
    try {
      const promptPath = path.resolve("asistente-ia", asistente.promptPath);
      if (!fs.existsSync(promptPath)) {
        console.warn(`⚠️ No se encontró prompt para ${asistente.role}`);
        continue;
      }

      const prompt = fs.readFileSync(promptPath, "utf-8");
      const idFilePath = `asistente-ia/roles/${asistente.role}/assistant_id.txt`;
      let assistantId: string | null = null;

      if (fs.existsSync(idFilePath)) {
        assistantId = fs.readFileSync(idFilePath, "utf8").trim();
      }

      const payload = {
        name: `asistente-${asistente.role}`,
        instructions: prompt,
        model: asistente.model,
        tools: asistente.tools // 👈 no toques esto, ya está bien desde JSON
      };

      const response = assistantId
        ? await openai.beta.assistants.update(assistantId, payload)
        : await openai.beta.assistants.create(payload);

      fs.writeFileSync(idFilePath, response.id);
      console.log(`✅ ${asistente.role}: ${assistantId ? "actualizado" : "creado"} → ${response.id}`);
    } catch (err) {
      console.error(`❌ Error en el asistente ${asistente.role}:`, err);
    }
  }
}

registrarAsistentes().catch((err) => {
  console.error("❌ Error inesperado:", err);
  process.exit(1);
});
