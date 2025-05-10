import fs from 'node:fs';
import path from 'node:path';

const logDir = path.resolve('asistente-ia', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

export function logRun(entry: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logLine = { timestamp, ...entry };
  fs.appendFileSync(
    path.join(logDir, 'runs.jsonl'),
    JSON.stringify(logLine) + '\n',
    'utf8'
  );
}
