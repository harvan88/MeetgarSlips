import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Obtiene el diff Git de un archivo respecto a HEAD.
 */
export function getDiff(filePath: string): string {
  try {
    const diff = execSync(`git diff HEAD ${filePath}`, { encoding: "utf-8" });
    return diff.trim() || "(sin cambios detectados)";
  } catch (err) {
    return "(error al calcular diff)";
  }
}

/**
 * Lee el contenido actual del archivo desde el sistema de archivos.
 */
export function getFileContent(filePath: string): string {
  try {
    const absolutePath = path.resolve(filePath);
    return fs.readFileSync(absolutePath, "utf-8");
  } catch {
    return "(error al leer archivo)";
  }
}
