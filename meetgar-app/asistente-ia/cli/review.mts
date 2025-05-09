#!/usr/bin/env -S tsx
/**
 * CLI: pnpm ia:review <rol> <ruta/al/archivo>
 * Ej.: pnpm ia:review ui src/componentes/SignOutButton.tsx
 *
 * – Lee el diff y el contenido actual del archivo indicado
 * – Construye un prompt de revisión de código completo
 * – Invoca al orquestador para que el asistente <rol> responda
 */

import path from 'node:path';
import { existsSync } from 'node:fs';
import assistants from '../assistants.json' assert { type: 'json' };

// shared/git exporta un default con helpers
import git from '../shared/git';
const { getDiff, getFileContent } = git;

// orquestador/router exporta runAssistant como *default*  ← IMPORTANTE
import runAssistant from '../orchestrator/router';

// ─────────────────────────────────────────
// 1. Parámetros de línea de comandos
// ─────────────────────────────────────────
const [rol, archivoCLI] = process.argv.slice(2);

if (!rol || !archivoCLI) {
  console.error(
    '❌  Sintaxis:\n    pnpm ia:review <rol> <ruta/al/archivo>\n' +
      '    Ej.: pnpm ia:review ui src/componentes/SignOutButton.tsx'
  );
  process.exit(2);
}

if (!assistants.some((a) => a.role === rol)) {
  console.error(`❌  Rol “${rol}” no definido en assistants.json`);
  process.exit(3);
}

// ─────────────────────────────────────────
// 2. Resolución de ruta y verificación
// ─────────────────────────────────────────
const absPath = path.resolve(archivoCLI);

if (!existsSync(absPath)) {
  console.error(`❌  Archivo no encontrado:\n    ${absPath}`);
  process.exit(4);
}

// ─────────────────────────────────────────
// 3. Construcción del prompt y llamada al asistente
// ─────────────────────────────────────────
try {
  const diff = getDiff(absPath); // ya sin problemas con espacios
  const contenido = getFileContent(absPath);

  const prompt = `
Archivo a revisar: ${archivoCLI}

\`\`\`tsx
${contenido}
\`\`\`

Diff con respecto a HEAD:
\`\`\`diff
${diff || '-- sin cambios --'}
\`\`\`

¿Puedes hacer una revisión de código completa?
  `.trim();

  await runAssistant(rol, prompt);
} catch (err) {
  console.error('🔥  Error ejecutando ia:review →', (err as Error).message);
  process.exit(5);
}
