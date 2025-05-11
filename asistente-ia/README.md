# Asistente IA

_Asistente IA_ es una herramienta CLI modular para gestionar asistentes virtuales basados en la API de OpenAI. El sistema permite orquestar distintos “roles” (por ejemplo, `ui`, `docs`, `bd`, etc.) y proveer prompts personalizados para cada uno, facilitando la integración y revisión de código u otros contenidos.

---

## Tabla de contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso desde CLI](#uso-desde-cli)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Creación y actualización de roles](#creación-y-actualización-de-roles)
- [Testing](#testing)
- [Variables de entorno](#variables-de-entorno)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Características

- **Modularidad:** Cada rol tiene su propia configuración, prompt y contexto.
- **CLI de fácil uso:** Ejecuta comandos como `pnpm ia:review <rol> <ruta/al/archivo>` para obtener revisiones automáticas.
- **Testing integrado:** Utiliza Vitest para garantizar el correcto funcionamiento de las funciones críticas (como `getFileContent` y `getDiff`).
- **Configuración independiente:** Funciona como un proyecto autónomo, sin depender de frameworks de frontend (Next.js, React, etc.).
- **Integración con OpenAI:** Permite crear y orquestar asistentes virtuales con instructivos personalizados.

---

## Instalación

### Requisitos
- [Node.js](https://nodejs.org/) (preferiblemente versión 16 o superior)
- [pnpm](https://pnpm.io/) como gestor de paquetes

### Pasos

1. **Clonar el repositorio o descargar el ZIP.**

2. **Instalar dependencias**

   Desde la raíz del proyecto:
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**

   Renombrá el archivo `.env.example` a `.env` y agregá tu clave de OpenAI:
   ```env
   OPENAI_API_KEY=sk-<tu_clave>
   ```

---

## Uso desde CLI

El proyecto incluye comandos CLI para interactuar con los asistentes.

### Ejemplo: Revisar un archivo

Ejecutá el siguiente comando para realizar una revisión de código usando el rol `ui`:
```bash
pnpm ia:review ui tests/prueba.ts
```

- **pnpm ia:review**: Llama al script definido en `cli/review.mts`.
- **ui**: Es el rol que se usará (debes tener un prompt configurado en `roles/ui/prompt.md`).
- **tests/prueba.ts**: Ruta al archivo que quieres analizar.

El sistema construirá un prompt basado en el contenido del archivo y el diff respecto a HEAD (si corresponde) y devolverá la respuesta del assistant.

---

## Estructura del proyecto

```
asistente-ia/
├── cli/
├── orchestrator/
├── roles/
│   └── ui/
│       ├── prompt.md
│       ├── assistant_id.txt
│       └── thread_id.txt
├── scripts/
├── shared/
├── tests/
├── .env.example
├── assistants.json
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## Creación y actualización de roles

Para agregar un nuevo rol:

1. Crear una carpeta en `roles/` con el nombre del rol (ej: `marketing`).
2. Crear `prompt.md` con el contenido de instrucciones.
3. Agregar archivos de contexto si son necesarios (`context/`, `runtime/`).
4. Verificar o actualizar `assistants.json`.

---

## Testing

Este proyecto usa **Vitest**.

Para correr los tests:
```bash
pnpm test
```

---

## Variables de entorno

```env
OPENAI_API_KEY=sk-<tu_clave>
```

Nunca incluyas el `.env` en repositorios públicos.

---

## Contribución

Si querés contribuir: pull requests, issues, y feedback son bienvenidos.

---

## Licencia

MIT

---

¡Gracias por usar Asistente IA!
