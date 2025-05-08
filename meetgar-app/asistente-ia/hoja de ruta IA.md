# Hoja de Ruta – Sistema Asistente IA para Desarrollo Modular

Esta hoja de ruta define etapas progresivas para construir un sistema modular de asistentes OpenAI integrados con el proyecto Meetgar Slips. El sistema apunta a combinar razonamiento IA con control real de código fuente en Next.js 14 + Supabase, estructurado con componentes reutilizables tipo LEGO.

---

## 🧠 Contexto actual del sistema
- Proyecto base: **Meetgar Slips** (Next.js 14, TailwindCSS, Supabase)
- Estructura modular alojada en `meetgar-app/asistente-ia/`
- Objetivo: usar OpenAI como copiloto inteligente para analizar, mejorar, refactorizar y documentar código en tiempo real
- Cada funcionalidad está separada por responsabilidad: lectura, análisis, refactor, backup, logs, evaluación, etc.
- Control total del flujo: el usuario inicia la consulta, la IA razona y el sistema guarda trazabilidad completa (`thread_id`, input, output, logs, errores, feedback humano)
- Sin uso de memoria persistente del asistente (el sistema gestiona el estado a través de archivos locales por hilo)

---

## 🔄 Nivel 1 – Base Funcional (en construcción)
- [ ] Uso de assistant único (orquestador principal)
- [ ] Estructura `asistente-ia/` generada por módulos independientes (`crearCarpetas`, `crearArchivosBase`)
- [ ] Creación de hilos por tarea (`thread_id` local)
- [ ] Adjuntar archivos actuales del proyecto automáticamente
- [ ] Guardar respuestas IA en `hilos/ui/*.json`
- [ ] Prompts separados por rol: `prompts/ui.prompt.txt`, `prompts/db.prompt.txt`, etc.
- [ ] Módulos: `leerArchivo.ts`, `backupArchivo.ts`, `actualizarCodigoIA.ts`

---

## 🧩 Nivel 2 – Módulos extendidos (LEGO funcional)
- [ ] `detectarErroresIA.ts` – análisis IA de errores comunes
- [ ] `agregarComentariosIA.ts` – agrega doc y comentarios sobre lógica o props
- [ ] `guardarLog.ts` – registra razonamiento IA en `logs/`
- [ ] `generarDiff.ts` – compara versiones y registra diferencias
- [ ] `comprobarContexto.ts` – valida que existan archivos antes de ejecutar IA

---

## ⚙️ Nivel 3 – Herramientas IA personalizadas (Tools API)
- [ ] Tool: `consultarHistorialDeErrores(componente)`
- [ ] Tool: `buscarEnDocs(query)` – búsqueda interna local
- [ ] Tool: `crearPullRequest(file, descripcion)`
- [ ] Tool: `correrTest(archivo)` – ejecuta test y devuelve resultado

---

## 🧠 Nivel 4 – Asistente interactivo tipo copiloto
- [ ] Flujo en pasos iterativos: detectar -> proponer -> validar -> aplicar
- [ ] Chat local por hilo, con seguimiento del progreso y estado
- [ ] Estado persistente de hilos en JSON y comparación entre ciclos

---

## 📦 Nivel 5 – Refactor global y aprendizaje adaptativo
- [ ] Analizar múltiples componentes en `src/componentes/`
- [ ] Detectar patrones de diseño, duplicación y errores comunes
- [ ] Sugerir mejoras estructurales entre archivos
- [ ] Generar documentación Markdown y resumen técnico por módulo
- [ ] Aprendizaje basado en feedback humano (retroalimentación + ajustes a prompts)

---

## 🧭 Recomendaciones generales
- Mantener estricta modularidad en `utils/`
- Nunca confiar en la memoria del asistente: usar hilos controlados y guardar todo local
- Versionar cambios en Git con tags automáticos por iteración
- Usar `diff` antes de sobrescribir cualquier archivo
- Iniciar con pruebas controladas sobre componentes individuales (`SlipList.tsx`, `OrdenDetalle.tsx`)
- Documentar cada consulta/respuesta IA que genere cambios para trazabilidad

---

