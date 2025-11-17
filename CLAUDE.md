# CLAUDE.md - MeetgarSlips Repository Guide for AI Assistants

> **Last Updated:** 2025-11-17
> **Repository:** MeetgarSlips
> **Purpose:** Guide for AI assistants working on the MeetgarSlips codebase

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Database Architecture](#database-architecture)
5. [Development Workflows](#development-workflows)
6. [Key Conventions](#key-conventions)
7. [Important Files & Directories](#important-files--directories)
8. [Working with the Codebase](#working-with-the-codebase)
9. [Testing Guidelines](#testing-guidelines)
10. [Common Patterns](#common-patterns)
11. [Troubleshooting](#troubleshooting)

---

## 📖 Project Overview

**MeetgarSlips** es un **módulo de lógica de negocio backend** para gestión de comandas (slips) en restaurantes. Este proyecto se enfoca exclusivamente en la **lógica de procesamiento de pedidos** y **distribución de notificaciones** entre diferentes actores del sistema.

### 🎯 Alcance del Proyecto

**⚠️ IMPORTANTE**: Este módulo **NO se encarga de**:
- Interfaz de usuario (UI/Frontend)
- Sistema de chat
- Inteligencia Artificial (IA)

**✅ Este módulo SÍ se encarga de**:
- Lógica completa de procesamiento de comandas/slips
- API REST (endpoints POST/GET) para comunicación con otros sistemas
- Distribución de notificaciones entre: meseros, cocina, caja, barra, cliente
- Gestión del flujo de estados de pedidos
- Control de autorización y permisos
- Orquestación entre diferentes instancias del negocio

### 🏗️ Arquitectura Modular Incremental

El sistema está diseñado bajo un **paradigma de modulación incremental**, permitiendo crear instancias separadas de responsabilidades:

**Módulos Planificados**:
1. **Core de Slips**: Recepción y procesamiento de comandas
2. **Sistema de Notificaciones**: Distribución inteligente a diferentes actores
3. **Gestión de Menú**: Administración de productos y disponibilidad
4. **Control de Stock**: Inventario y disponibilidad en tiempo real
5. **Módulo de Caja**: Gestión de pagos y facturación
6. **Módulo de Barra**: Gestión específica de bebidas
7. **Módulo de Cocina**: Gestión de preparación de alimentos
8. **Administración**: Panel de control y configuración

### 📊 Estado Actual del Proyecto

**Fase**: Ideación y diseño arquitectónico

El proyecto está en proceso de definición de la mejor arquitectura posible para crear un componente **robusto, escalable y modular**. Las decisiones arquitectónicas priorizan:

- Separación de responsabilidades (Separation of Concerns)
- Escalabilidad horizontal
- Facilidad de integración con sistemas externos
- Resiliencia y tolerancia a fallos
- Mantenibilidad a largo plazo

### 🔌 Integración con Sistemas Externos

Este módulo expone APIs REST que pueden ser consumidas por:
- Aplicaciones frontend (web, móvil)
- Sistemas de chat y atención al cliente
- Sistemas de IA para procesamiento de pedidos por voz/texto
- Sistemas de punto de venta (POS)
- Aplicaciones de gestión de restaurante

### Main Components

1. **meetgar-app**: Módulo principal de lógica de negocio y APIs (Next.js 15)
2. **asistente-ia**: Herramienta CLI para revisión de código (desarrollo)
3. **scripts-python**: Scripts de utilidad para automatización

### Core Functionality

- **Gestión de Slips**: Creación, modificación y agrupación de comandas
- **Sistema de Notificaciones**: Distribución inteligente a meseros, cocina, caja, barra
- **Control de Estados**: Gestión del ciclo de vida de pedidos
- **División de Pagos**: Pagos parciales por usuario o producto
- **Control de Autorizaciones**: Gestión de permisos entre usuarios
- **Roles Diferenciados**: cliente, mesero, cocina, caja, barra, admin
- **Tracking de Ubicaciones**: Gestión de ubicaciones en tiempo real

---

## 🗂️ Repository Structure

```
MeetgarSlips/
├── meetgar-app/                    # Módulo principal de lógica de negocio
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/              # ⭐ API REST endpoints (núcleo del sistema)
│   │   │   │   ├── slips/        # Endpoints de gestión de comandas
│   │   │   │   ├── orders/       # Endpoints de órdenes agrupadas
│   │   │   │   ├── notifications/ # Sistema de notificaciones
│   │   │   │   ├── menu/         # Gestión de menú y productos
│   │   │   │   ├── stock/        # Control de inventario
│   │   │   │   └── payments/     # Procesamiento de pagos
│   │   │   ├── (app)/            # Rutas de app (legacy/opcional)
│   │   │   ├── auth/             # Autenticación y autorización
│   │   │   └── [otras rutas]     # Otras rutas según necesidad
│   │   ├── componentes/          # Componentes (si se necesita UI mínima)
│   │   └── lib/                  # Lógica de negocio y utilidades
│   │       ├── supabase/         # Cliente de base de datos
│   │       ├── database.types.ts # Tipos de TypeScript de BD
│   │       ├── notifications/    # Sistema de notificaciones
│   │       ├── business-logic/   # Lógica de negocio modular
│   │       └── utils/            # Utilidades compartidas
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js        # (opcional, solo si hay UI)
│
├── asistente-ia/                   # AI Assistant CLI tool
│   ├── cli/                       # CLI entry points
│   ├── orchestrator/              # Orchestration logic
│   ├── roles/                     # Role-based prompts
│   │   ├── ui/                   # UI specialist
│   │   ├── docs/                 # Documentation specialist
│   │   ├── bd/                   # Database specialist
│   │   ├── test/                 # Testing specialist
│   │   └── orquestador/          # Orchestrator
│   ├── scripts/                   # Utility scripts
│   ├── shared/                    # Shared utilities
│   ├── tests/                     # Test files
│   ├── package.json
│   └── tsconfig.json
│
├── scripts-python/                 # Python utilities
│   ├── core/                      # Core Python modules
│   └── tools/                     # Python tools
│
├── estructura de tablas supabase.json  # Database schema export
├── README_tecnico_Backend_meetgar_slips.md
├── preguntas_frecuentes_clientes.md
├── prompt_asistente_frontend_meetgar.md
└── .gitignore
```

---

## 🛠️ Technology Stack

### meetgar-app (Backend API / Business Logic)

- **Framework**: Next.js 15.3.1 (usado como backend API con App Router)
- **Runtime**: Node.js con React 19.0.0 (Server Components para APIs)
- **Language**: TypeScript 5+ (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (para protección de endpoints)
- **API Architecture**: REST API (POST/GET endpoints)
- **Testing**: Vitest 3.1.3
- **Package Manager**: npm (compatible con pnpm/yarn/bun)
- **Styling**: Tailwind CSS 4.1.5 (opcional, solo si se necesita UI administrativa)

**Nota sobre Next.js**: Aunque Next.js es tradicionalmente un framework fullstack, en este proyecto se utiliza **principalmente para sus capacidades de backend**:
- API Routes para endpoints REST
- Server Components para lógica del lado del servidor
- Middleware para autenticación y autorización
- Edge Runtime (opcional) para mejor performance

### asistente-ia (CLI Tool)

- **Runtime**: Node.js (ESM modules)
- **Language**: TypeScript 5.4.5
- **AI Provider**: OpenAI API
- **Testing**: Vitest
- **Package Manager**: pnpm

### scripts-python

- **Language**: Python 3.x
- **Virtual Environment**: .venv

---

## 🗄️ Database Architecture

### Supabase Tables

The application uses a PostgreSQL database hosted on Supabase with the following main tables:

#### Core Tables

1. **users**
   - `id` (uuid, PK)
   - `nombre`, `email`, `imagen_url`
   - `rol` (enum: 'cliente', 'mesero', 'cocina', 'admin')
   - `creado_en` (timestamp)

2. **restaurantes**
   - `id` (uuid, PK)
   - `nombre`, `logo_url`, `codigo_unico`
   - `owner_id` (uuid, FK → users)
   - `creado_en` (timestamp)

3. **orders**
   - `id` (uuid, PK)
   - `user_id` (uuid, FK → users)
   - `codigo_unico` (text)
   - `estado` (text, default: 'abierta')
   - `mesero_id` (uuid, FK → users)
   - `restaurante_id` (uuid, FK → restaurantes)
   - `creado_en` (timestamp)

4. **slips** (Individual orders)
   - `id` (uuid, PK)
   - `order_id` (uuid, FK → orders)
   - `user_id` (uuid, FK → users)
   - `estado` (enum: 'pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado')
   - `comentario` (text)
   - `restaurante_id` (uuid, FK → restaurantes)
   - `creado_en`, `actualizado_en` (timestamps)

5. **productos**
   - `id` (uuid, PK)
   - `nombre`, `descripcion`, `precio`
   - `imagen_url` (text)
   - `disponible` (boolean, default: true)
   - `restaurante_id` (uuid, FK → restaurantes)

6. **slip_productos** (Products in a slip)
   - `id` (uuid, PK)
   - `slip_id` (uuid, FK → slips)
   - `producto_id` (uuid, FK → productos)
   - `cantidad` (integer)
   - `precio_unitario`, `total` (numeric)

7. **pagos** (Payments)
   - `id` (uuid, PK)
   - `slip_producto_id` (uuid, FK → slip_productos)
   - `pagado_por_user_id` (uuid, FK → users)
   - `monto` (numeric)
   - `metodo` (text)
   - `creado_en` (timestamp)

8. **slip_autorizaciones** (Authorization requests)
   - `id` (uuid, PK)
   - `solicitante_id` (uuid, FK → users)
   - `order_id` (uuid, FK → orders)
   - `estado` (text: 'pendiente', 'aceptado', 'rechazado')
   - `creado_en` (timestamp)

9. **ubicaciones** (Location tracking)
   - `id` (uuid, PK)
   - `user_id` (uuid, FK → users)
   - `latitud`, `longitud` (numeric)
   - `restaurante_id` (uuid, FK → restaurantes)
   - `actualizado_en` (timestamp)

### Database Conventions

- All IDs use UUID (gen_random_uuid())
- Timestamps use `now()` as default
- Soft deletes are not implemented (use estado fields instead)
- Column names use snake_case (e.g., `user_id`, `creado_en`)
- TypeScript types are generated in `database.types.ts`

---

## ⚙️ Development Workflows

### meetgar-app

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm test
```

### asistente-ia

```bash
# Install dependencies
pnpm install

# Review code with AI assistant
pnpm ia:review <role> <file-path>
# Example: pnpm ia:review ui src/app/page.tsx

# Check assistant configurations
pnpm ia:check

# Run tests
pnpm test
```

### Environment Variables

**meetgar-app** requires (create `.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**asistente-ia** requires (create `.env`):
```env
OPENAI_API_KEY=sk-your_openai_key
```

---

## 📏 Key Conventions

### Code Style

1. **TypeScript Strict Mode**: Enabled in all projects
2. **Naming Conventions**:
   - Components: PascalCase (`SignOutButton.tsx`)
   - Files: camelCase for utilities, kebab-case for routes
   - Database fields: snake_case
   - TypeScript interfaces/types: PascalCase

3. **Import Aliases**:
   - Use `@/` for imports from `src/` directory
   - Example: `import { createSupabaseServerClient } from '@/lib/supabase/server'`

4. **File Organization**:
   - Components go in `src/componentes/`
   - Utilities and configs go in `src/lib/`
   - API routes go in `src/app/api/`
   - Pages use App Router convention in `src/app/`

### API y Backend Patterns

1. **API Routes como Core**: Las rutas en `src/app/api/` son el núcleo del sistema
2. **Server-Side Only**: Todo el procesamiento debe ocurrir en el servidor (no en cliente)
3. **RESTful Design**: Seguir principios REST para endpoints (GET, POST, PUT, DELETE)
4. **Response Format Consistente**:
   ```typescript
   { success: boolean, data?: any, error?: string, message?: string }
   ```
5. **Supabase Client**:
   - APIs: Usar siempre `createSupabaseServerClient()` from `@/lib/supabase/server`
   - No usar clientes del lado del navegador en este proyecto
6. **Validación de Entrada**: Validar todos los datos de entrada en cada endpoint
7. **Manejo de Errores**: Try-catch en todos los endpoints con respuestas apropiadas

### Architecture Principles (Arquitectura Modular)

1. **Separation of Concerns**: Cada módulo tiene una responsabilidad única y bien definida
2. **Modulación Incremental**: Los módulos pueden desarrollarse y desplegarse independientemente
3. **API-First Design**: La lógica de negocio se expone vía API REST
4. **Desacoplamiento Frontend/Backend**: No asumir ningún frontend específico
5. **Type Safety**: Siempre usar tipos de TypeScript desde `database.types.ts`
6. **Sistema de Notificaciones**: Arquitectura pub-sub para distribución de eventos
7. **Escalabilidad Horizontal**: Diseño que permite múltiples instancias
8. **Estado en Base de Datos**: La base de datos es la única fuente de verdad
9. **Idempotencia**: Las operaciones deben ser seguras para reintentos
10. **Logging y Observabilidad**: Registrar eventos importantes para debugging

### Git Workflow

- **Main Branch**: Usually `main` or `master` (check repo for actual name)
- **Feature Branches**: Follow pattern `claude/claude-md-<session-id>`
- **Commits**: Clear, descriptive messages in English or Spanish
- **Never Commit**: `.env`, `.env.local`, `node_modules/`, `.venv/`

---

## 📁 Important Files & Directories

### Configuration Files

- `meetgar-app/tsconfig.json`: TypeScript configuration with path aliases
- `meetgar-app/tailwind.config.js`: Tailwind CSS configuration
- `meetgar-app/package.json`: Dependencies and scripts
- `estructura de tablas supabase.json`: Complete database schema export

### Key Source Files

- `meetgar-app/src/lib/supabase/server.ts`: Server-side Supabase client
- `meetgar-app/src/lib/supabase/client.ts`: Client-side Supabase client
- `meetgar-app/src/lib/database.types.ts`: Generated TypeScript types
- `meetgar-app/src/app/layout.tsx`: Root layout with global styles
- `meetgar-app/src/app/(app)/layout.tsx`: Authenticated app layout

### Documentation

- `README_tecnico_Backend_meetgar_slips.md`: Backend technical documentation
- `prompt_asistente_frontend_meetgar.md`: Frontend development guidelines
- `preguntas_frecuentes_clientes.md`: Example customer conversations
- `asistente-ia/README.md`: AI assistant tool documentation

---

## 💻 Working with the Codebase

### When Making Changes

1. **Understand the Context**:
   - Read relevant documentation files first
   - Check existing patterns in similar files
   - Understand the database relationships

2. **Follow the Style Guide**:
   - Use the existing code style
   - Focus on backend/API development (not UI)
   - Maintain TypeScript strict mode compliance
   - Follow modular architecture principles

3. **Test Your Changes**:
   - Test API endpoints with tools like Postman, curl, or Thunder Client
   - Check for TypeScript errors: `npm run build`
   - Run linter: `npm run lint`
   - Verify authentication/authorization in endpoints
   - Test database operations and transactions

4. **Avoid Common Mistakes**:
   - Don't create UI components unless explicitly needed
   - Don't mix frontend logic with backend API logic
   - Don't expose sensitive data in API responses
   - Don't modify Supabase client configurations without understanding implications
   - Don't commit environment files (.env, .env.local)
   - Don't skip input validation in API endpoints
   - Don't assume frontend structure (this is backend only)

### Adding New Features (Módulos y APIs)

1. **Nuevos Módulos**:
   - Diseñar el módulo con responsabilidad única
   - Crear carpeta en `src/lib/business-logic/<modulo>/`
   - Definir interfaces y tipos en TypeScript
   - Implementar lógica de negocio independiente
   - Crear endpoints API correspondientes

2. **Nuevos API Endpoints**:
   - Crear en `src/app/api/<recurso>/route.ts`
   - Implementar métodos HTTP necesarios (GET, POST, PUT, DELETE)
   - Validar entrada con TypeScript y validación runtime
   - Usar `createSupabaseServerClient()` para operaciones de BD
   - Implementar manejo de errores robusto
   - Retornar códigos HTTP apropiados (200, 201, 400, 401, 404, 500)
   - Documentar el endpoint (parámetros, respuestas, errores)

3. **Sistema de Notificaciones**:
   - Definir tipo de notificación y destinatarios
   - Implementar en `src/lib/notifications/`
   - Registrar eventos en base de datos
   - Considerar integración con servicios externos (webhooks, push notifications)

4. **Cambios en Base de Datos**:
   - Actualizar schema en Supabase dashboard
   - Regenerar tipos TypeScript (si está configurado)
   - Actualizar `estructura de tablas supabase.json`
   - Considerar migraciones y retrocompatibilidad
   - Documentar cambios en el schema

### Using the AI Assistant (asistente-ia)

The repository includes a custom AI code review tool:

```bash
# Review UI changes
pnpm ia:review ui src/app/dashboard/page.tsx

# Review database logic
pnpm ia:review bd src/app/api/sync-user/route.ts

# Review documentation
pnpm ia:review docs README.md

# Review tests
pnpm ia:review test tests/prueba.ts
```

Each role has specialized knowledge configured in `asistente-ia/roles/*/prompt.md`.

---

## 🧪 Testing Guidelines

### meetgar-app

- Testing framework: Vitest 3.1.3
- Test files: Co-locate with source files or use `__tests__` directories
- Run tests: `npm test`
- TypeScript types for Vitest are included in tsconfig.json

### asistente-ia

- Testing framework: Vitest
- Test files: Located in `tests/` directory
- Run tests: `pnpm test`
- Tests include file reading and git diff functionality

### Manual Testing Checklist (API Testing)

- [ ] **Endpoints de Autenticación**: Verificar tokens y autorización
- [ ] **Endpoints de Slips**: Crear, leer, actualizar, eliminar comandas
- [ ] **Sistema de Notificaciones**: Verificar distribución a meseros, cocina, caja
- [ ] **Control de Roles**: Probar endpoints con diferentes roles (cliente, mesero, cocina, admin)
- [ ] **Validación de Entrada**: Enviar datos inválidos y verificar respuestas 400
- [ ] **Manejo de Errores**: Network errors, auth errors, database errors
- [ ] **Row-Level Security (RLS)**: Verificar que políticas de Supabase funcionan correctamente
- [ ] **Transacciones**: Operaciones que requieren múltiples cambios en BD
- [ ] **Idempotencia**: Reintentar operaciones y verificar resultados consistentes
- [ ] **Performance**: Medir tiempos de respuesta de endpoints críticos

**Herramientas Recomendadas**:
- Postman o Insomnia para testing de APIs
- Thunder Client (extensión VS Code)
- curl para testing rápido desde terminal
- Vitest para tests automatizados

---

## 🔄 Common Patterns

### Patrón Base de API Route

```typescript
// src/app/api/slips/route.ts
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    // 1. Autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    // 2. Validación de entrada
    const body = await request.json()
    if (!body.required_field) {
      return NextResponse.json(
        { success: false, error: 'Campo requerido faltante' },
        { status: 400 }
      )
    }

    // 3. Lógica de negocio
    const { data, error } = await supabase
      .from('slips')
      .insert({ ...body, user_id: user.id })
      .select()
      .single()

    if (error) throw error

    // 4. Respuesta exitosa
    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en POST /api/slips:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)

    const orderId = searchParams.get('order_id')

    const { data, error } = await supabase
      .from('slips')
      .select('*, slip_productos(*)')
      .eq('order_id', orderId)

    if (error) throw error

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Error en GET /api/slips:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener slips' },
      { status: 500 }
    )
  }
}
```

### Patrón de Módulo de Lógica de Negocio

```typescript
// src/lib/business-logic/slips/slipManager.ts
import { Database } from '@/lib/database.types'

type Slip = Database['public']['Tables']['slips']['Row']
type SlipInsert = Database['public']['Tables']['slips']['Insert']

export class SlipManager {
  constructor(private supabase: any) {}

  async createSlip(data: SlipInsert): Promise<Slip> {
    const { data: slip, error } = await this.supabase
      .from('slips')
      .insert(data)
      .select()
      .single()

    if (error) throw new Error(`Error creando slip: ${error.message}`)
    return slip
  }

  async getSlipsByOrder(orderId: string): Promise<Slip[]> {
    const { data, error } = await this.supabase
      .from('slips')
      .select('*')
      .eq('order_id', orderId)

    if (error) throw new Error(`Error obteniendo slips: ${error.message}`)
    return data || []
  }

  async updateSlipStatus(slipId: string, estado: string): Promise<Slip> {
    const { data, error } = await this.supabase
      .from('slips')
      .update({ estado, actualizado_en: new Date().toISOString() })
      .eq('id', slipId)
      .select()
      .single()

    if (error) throw new Error(`Error actualizando slip: ${error.message}`)

    // Trigger notificación
    await this.notifyStatusChange(data)

    return data
  }

  private async notifyStatusChange(slip: Slip) {
    // Lógica de notificación
    // Enviar a meseros, cocina, cliente según el estado
  }
}
```

### Patrón de Sistema de Notificaciones

```typescript
// src/lib/notifications/notificationManager.ts
type NotificationType = 'slip_created' | 'slip_updated' | 'order_ready' | 'payment_received'
type RecipientRole = 'cliente' | 'mesero' | 'cocina' | 'caja' | 'barra'

interface Notification {
  type: NotificationType
  recipients: RecipientRole[]
  data: any
  priority: 'low' | 'medium' | 'high'
}

export class NotificationManager {
  async distribute(notification: Notification) {
    // Lógica para distribuir según destinatarios
    for (const role of notification.recipients) {
      await this.sendToRole(role, notification)
    }
  }

  private async sendToRole(role: RecipientRole, notification: Notification) {
    // Implementación: webhook, push notification, websocket, etc.
    console.log(`Enviando notificación a ${role}:`, notification)
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues (Backend/API)

1. **API Route 401 (Unauthorized)**
   - **Causa**: Usuario no autenticado o token inválido
   - **Solución**: Verificar que el cliente envía headers de autenticación correctos, revisar configuración de Supabase Auth

2. **API Route 500 (Internal Server Error)**
   - **Causa**: Error no manejado en lógica de negocio o database query
   - **Solución**: Revisar logs del servidor, verificar try-catch en endpoints, validar queries de Supabase

3. **Errores de Supabase Auth**
   - **Causa**: Variables de entorno faltantes o incorrectas
   - **Solución**: Verificar `.env.local` tiene `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Errores de TypeScript en Database Queries**
   - **Causa**: Tipos de base de datos desactualizados
   - **Solución**: Regenerar `database.types.ts` desde Supabase, actualizar schema si cambió

5. **Row-Level Security (RLS) Errors**
   - **Causa**: Políticas RLS de Supabase bloquean operaciones
   - **Solución**: Revisar políticas en Supabase Dashboard, verificar que usuario tiene permisos correctos

6. **CORS Errors (en desarrollo con clientes externos)**
   - **Causa**: Next.js no permite requests desde otros orígenes
   - **Solución**: Configurar CORS headers en `next.config.js` o en API routes individuales

7. **Database Connection Errors**
   - **Causa**: Límite de conexiones excedido o timeout
   - **Solución**: Verificar conexión a Supabase, considerar connection pooling, revisar firewall

8. **Import Errors**
   - **Causa**: Path incorrecto o alias `@/` no configurado
   - **Solución**: Usar `@/` para imports desde `src/`, verificar `tsconfig.json` paths

9. **Build Errors (TypeScript Strict)**
   - **Causa**: Violaciones de TypeScript strict mode
   - **Solución**: Corregir errores de tipos, no usar `any`, manejar null/undefined apropiadamente

10. **Webhook/Notification Failures**
    - **Causa**: Sistema de notificaciones no alcanza destinatarios
    - **Solución**: Verificar logs, revisar configuración de webhooks, validar endpoints de destino

### Getting Help

- Revisar documentación en el repositorio
- Analizar commits recientes para contexto
- Usar `asistente-ia` para code review: `pnpm ia:review bd <archivo>`
- Testear en modo desarrollo antes de build
- Revisar logs del servidor con `console.error`
- Usar herramientas de debugging como Postman o curl

---

## 🎯 Quick Reference

### File Locations

| What | Where |
|------|-------|
| **API Routes** (núcleo) | `meetgar-app/src/app/api/` |
| **Lógica de Negocio** | `meetgar-app/src/lib/business-logic/` |
| **Sistema de Notificaciones** | `meetgar-app/src/lib/notifications/` |
| Supabase Clients | `meetgar-app/src/lib/supabase/` |
| Database Types | `meetgar-app/src/lib/database.types.ts` |
| Utilidades | `meetgar-app/src/lib/utils/` |
| Componentes (si existen) | `meetgar-app/src/componentes/` |
| AI Assistant Roles | `asistente-ia/roles/` |
| Database Schema | `estructura de tablas supabase.json` |

### Commands Quick Reference

```bash
# meetgar-app
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint

# asistente-ia
pnpm ia:review ui <file>    # Review UI code
pnpm ia:review bd <file>    # Review database code
pnpm test                   # Run tests
```

### Port Numbers

- **meetgar-app dev**: http://localhost:3000
- **meetgar-app production**: Port configured by hosting

---

## 📝 Notes for AI Assistants

### ⚠️ CRÍTICO: Entender el Alcance del Proyecto

**Este NO es un proyecto de frontend/UI. Este es un BACKEND de lógica de negocio.**

- ❌ NO crear componentes de UI a menos que sea absolutamente necesario
- ❌ NO asumir que habrá interfaz de usuario
- ❌ NO implementar features de chat o IA (están fuera del alcance)
- ✅ SÍ enfocarse en APIs REST y lógica de negocio
- ✅ SÍ diseñar para ser consumido por clientes externos
- ✅ SÍ pensar en arquitectura modular y escalable

### When Assisting with This Codebase

1. **Backend API-First** - El núcleo son los endpoints REST en `src/app/api/`
2. **Arquitectura Modular Incremental** - Cada módulo debe ser independiente y escalable
3. **Use TypeScript Strictly** - No usar `any`, manejar todos los tipos y nullables
4. **Sistema de Notificaciones** - Considerar distribución a meseros, cocina, caja, barra, cliente
5. **Review Documentation First** - Revisar archivos .md relevantes antes de hacer cambios
6. **Understand Database Schema** - Revisar `estructura de tablas supabase.json` detalladamente
7. **Separation of Concerns** - Lógica de negocio separada de APIs, modular por responsabilidad
8. **Don't Modify Config Files** - No modificar configuraciones sin justificación clara
9. **Git Branch Naming** - Usar prefijo `claude/` para feature branches
10. **Server-Side Only** - Solo usar `createSupabaseServerClient()`, no clientes de browser
11. **Estado de Ideación** - El proyecto está en fase de diseño arquitectónico, ser flexible
12. **Pensar en Escalabilidad** - Diseñar para múltiples instancias y alta carga

### Understanding User Roles

- **cliente**: Usuario final que crea slips y hace pedidos
- **mesero**: Camarero que gestiona órdenes y atiende clientes (recibe notificaciones)
- **cocina**: Personal de cocina que prepara pedidos (recibe notificaciones de cocina)
- **caja**: Personal de caja que procesa pagos (recibe notificaciones de pago)
- **barra**: Personal de barra que prepara bebidas (recibe notificaciones de bebidas)
- **admin**: Administrador con acceso completo al sistema

### Key Business Logic

- Un **slip** es una comanda individual creada por un usuario
- Una **order** agrupa múltiples slips de diferentes usuarios
- Los usuarios pueden solicitar unirse a una orden (requiere autorización del creador)
- Los **pagos** pueden dividirse por producto o por usuario
- El **sistema de notificaciones** distribuye eventos a diferentes roles según el contexto:
  - Nuevo slip → mesero + cocina/barra según productos
  - Cambio de estado → cliente + mesero
  - Pago recibido → caja + mesero + cliente
  - Pedido listo → mesero + cliente
- La **ubicación en tiempo real** ayuda a coordinar entregas
- La arquitectura permite **módulos independientes** (menú, stock, caja, etc.)

### Módulos Planificados (Referencia)

Al trabajar en este proyecto, considerar que la arquitectura soporta estos módulos:
1. **Core de Slips** - Gestión de comandas
2. **Sistema de Notificaciones** - Distribución de eventos
3. **Gestión de Menú** - CRUD de productos
4. **Control de Stock** - Inventario
5. **Módulo de Caja** - Pagos y facturación
6. **Módulo de Barra** - Bebidas
7. **Módulo de Cocina** - Preparación de alimentos
8. **Administración** - Configuración

---

**End of CLAUDE.md**

> This document is maintained by AI assistants working on the MeetgarSlips codebase. Update it as the project evolves.
