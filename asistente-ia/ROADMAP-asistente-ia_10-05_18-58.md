<!-- ::ROADMAP-ASISTENTE-IA:: -->

# 🧠 Resumen técnico del funcionamiento actual — `asistente-ia`

El sistema `asistente-ia` es una herramienta CLI modular que permite gestionar múltiples asistentes virtuales basados en la API de OpenAI. Está orientado al desarrollo de workflows por rol y análisis contextualizado de código fuente.

---

## 📦 Estructura general

```

├── cli/                # Comandos CLI (ej. review.mts, index.ts)
├── orchestrator/       # Lógica para crear threads, runs y obtener respuestas
├── roles/              # Múltiples roles, cada uno con su prompt.md y configuración
├── scripts/            # Utilidades para inicializar estructura de roles
├── shared/             # Módulos comunes (git.ts, log.ts)
├── assistants.json     # Mapea assistants reales (OpenAI) con nombres internos
├── README.md           # (Inicial) Documentación del sistema
```

---

## ⚙️ Funcionalidad clave

- `router.ts`: punto central para crear un `thread`, ejecutar un `run` y obtener la respuesta desde la API de OpenAI.
- `review.mts`: CLI que lanza el asistente con un archivo de entrada, usando el prompt del rol especificado (`ui`, `docs`, `bd`, etc.).
- `bootstrap.ts`, `crearEstructura.ts`: scripts para inicializar roles con carpetas, prompts y archivos de contexto.
- `log.ts`: sistema de logging básico. Puede ampliarse para incluir niveles.
- `git.ts`: obtiene `diff` y contenido de archivos del repositorio para enviar como contexto.
- `roles/*/`: cada subcarpeta representa un assistant especializado, versionado con sus propios archivos.

---

## 📉 Diagnóstico profesional

| Área                  | Estado actual | Comentario breve |
|-----------------------|----------------|------------------|
| Modularidad           | ✅ Alta         | Muy buena separación de responsabilidades por rol y capa |
| Legibilidad           | ✅ Clara        | Código bien escrito, mantenible |
| Manejo de errores     | ⚠️ Limitado     | Poco robusto frente a fallos de red, API o archivos faltantes |
| Tests automatizados   | ❌ Inexistentes | No se detectan pruebas (`*.test.ts`) |
| Documentación         | ⚠️ Parcial      | El README es mínimo; no explica estructura ni uso profundo |
| Logging               | ⚠️ Básico       | Logging simple, sin niveles ni control desde CLI |
| Escalabilidad         | ⚠️ Intermedia   | Funciona bien en local; necesita mejoras para entornos multiusuario o integración CI/CD |

---

# 🛠 Roadmap de Mejora Técnica — `asistente-ia`

Plan incremental para alcanzar nivel profesional y facilitar su mantenimiento, testeo y distribución.

---

## ✅ Fase 1: Robustez mínima (Prioridad alta)
**Objetivo:** evitar errores silenciosos y establecer primeras pruebas automáticas.

### Tareas
- [ ] Refactor `router.ts`:
  - [ ] Manejar error si falta `assistant_id.txt`
  - [ ] Agregar `try/catch` para llamadas a `openai.beta.threads.runs.create`
- [ ] Refactor `cli/review.mts`:
  - [ ] Validar existencia de `prompt.md` antes de continuar
  - [ ] Manejar error si `runAssistant` no devuelve respuesta
- [ ] Crear primer test unitario en `shared/`:
  - [ ] Test para `getFileContent()` en `git.ts`

⏳ Estimación: 3–4 horas  
📦 Resultado: sistema más confiable + primer test corriendo

---

## 📚 Fase 2: Documentación y logging
**Objetivo:** permitir que cualquier persona pueda usar, extender y entender el sistema.

### Tareas
- [ ] Redactar `README.md` completo:
  - [ ] Instrucciones de instalación
  - [ ] Explicación de estructura de carpetas y propósito de cada parte
  - [ ] Ejemplos de uso CLI (`review`, creación de roles)
- [ ] Agregar flag `--verbose` a `review.mts` para debug
- [ ] Extender `shared/log.ts`:
  - [ ] Soporte para niveles `info`, `warn`, `error`, `debug`
  - [ ] Que el CLI pueda activarlos

⏳ Estimación: 3–4 horas  
📦 Resultado: documentación clara + logging flexible

---

## 📦 Fase 3: Empaquetado y testeo de integración
**Objetivo:** distribuir, escalar y validar el uso real del sistema.

### Tareas
- [ ] Crear `package.json` con entrada CLI (`bin`)
- [ ] Soporte para ejecutar como `npx asistente-ia review ...`
- [ ] Mock de OpenAI API:
  - [ ] Permitir tests sin conexión real
- [ ] Test de flujo completo (E2E):
  - [ ] `crearEstructura` → modificar `prompt.md` → ejecutar `review.mts` → validar salida

⏳ Estimación: 4–6 horas  
📦 Resultado: CLI profesional, instalable y verificada automáticamente

---

📌 Este roadmap será actualizado iterativamente junto al avance del desarrollo y el acompañamiento técnico de ChatGPT.

<!-- ::FIN-ROADMAP-ASISTENTE-IA:: -->
