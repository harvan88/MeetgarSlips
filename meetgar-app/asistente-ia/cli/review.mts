#!/usr/bin/env -S tsx
/**
 * CLI  ▸  pnpm ia:review <rol> <ruta/al/archivo>
 * Ej.: pnpm ia:review ui src/componentes/SignOutButto.tsx
 */
import path from 'node:path';
import { existsSync } from 'node:fs';
import assistants from '../assistants.json' assert { type: 'json' };

// helpers Git
import git from '../shared/git';
const { getDiff, getFileContent } = git;

//────────────────────────────────────────────────────────────
// 1) Resolver dinámicamente runAssistant en cualquier formato
//────────────────────────────────────────────────────────────
import routerModule from '../orchestrator/router';
const runAssistant =
  typeof routerModule === 'function'
    ? routerModule
    : typeof (routerModule as any)?.default === 'function'
      ? (routerModule as any).default
      : typeof (routerModule as any)?.runAssistant === 'function'
        ? (routerModule as any).runAssistant
        : (() => {
            throw new Error(
              "⚠️  No se encontró la función 'runAssistant' en orchestrator/router"
            );
          })();

//────────────────────────────────────────────────────────────
// 2) Leer argumentos y validar
//────────────────────────────────────────────────────────────
const [rol, archivoRel] = process.argv.slice(2);

if (!rol || !archivoRel) {
  console.error(
    '❌  Sintaxis:\n    pnpm ia:review <rol> <ruta/al/archivo>'
  );
  process.exit(2);
}

if (!assistants.some((a) => a.role === rol)) {
  console.error(`❌  Rol “${rol}” no definido en assistants.json`);
  process.exit(3);
}

const absPath = path.resolve(archivoRel);
if (!existsSync(absPath)) {
  console.error(`❌  Archivo no encontrado:\n    ${absPath}`);
  process.exit(4);
}

//────────────────────────────────────────────────────────────
// 3) Construir prompt y pedir revisión
//────────────────────────────────────────────────────────────
try {
  const diff = getDiff(absPath);
  const contenido = getFileContent(absPath);

  const prompt = `
Archivo en revisión: ${archivoRel}

\`\`\`tsx
${contenido}
\`\`\`

Diff respecto a HEAD:
\`\`\`diff
${diff || '-- sin cambios --'}
\`\`\`

¿Puedes hacer una revisión de código completa?
  `.trim();

  const respuesta = await runAssistant(rol, prompt);
  
  process.stdout.write(`\n── Respuesta del assistant (“${rol}”) ──\n${respuesta}\n`);
} catch (err) {
  console.error('🔥  Error ejecutando ia:review →', (err as Error).message);
  process.exit(5);
}
