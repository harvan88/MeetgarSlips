import fs from "fs";
import path from "path";

const roles = ["orquestador", "ui", "bd", "docs", "test"];
const baseDir = path.resolve(__dirname, "../roles");

for (const role of roles) {
  const rolePath = path.join(baseDir, role);
  const contextPath = path.join(rolePath, "context");
  const runtimePath = path.join(rolePath, "runtime");
  const promptPath = path.join(rolePath, "prompt.md");

  [rolePath, contextPath, runtimePath].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Creada: ${dir}`);
    }
  });

  if (!fs.existsSync(promptPath)) {
    fs.writeFileSync(
      promptPath,
      `# Prompt del rol ${role}\n\nEspecificar aquí el comportamiento principal del asistente ${role}.`
    );
    console.log(`📝 Creado: ${promptPath}`);
  }
}
