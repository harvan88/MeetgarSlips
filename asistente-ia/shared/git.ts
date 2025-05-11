import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

/**
 * Devuelve el diff del archivo. Si no hay cambios o Git falla, devuelve ''.
 */
export function getDiff(absPath: string): string {
  try {
    // execFileSync evita problemas de espacios y no requiere escapado manual
    return execFileSync('git', ['diff', '--no-color', '--', absPath], {
      encoding: 'utf8',
    });
  } catch {
    return '';
  }
}

/**
 * Devuelve el contenido actual del archivo. Si no existe, lanza un error claro.
 */
export function getFileContent(absPath: string): string {
  if (!existsSync(absPath)) {
    throw new Error(`Archivo no encontrado: ${absPath}`);
  }
  return readFileSync(absPath, 'utf8');
}

export default { getDiff, getFileContent };
