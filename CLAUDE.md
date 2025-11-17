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

**MeetgarSlips** is a mobile-first restaurant ordering application that allows diners to create individual orders ("slips") that can be grouped into collective orders and shared among users. The system supports split payments, real-time location tracking, and role-based access control.

### Main Components

1. **meetgar-app**: Next.js 15 mobile web application (primary frontend)
2. **asistente-ia**: OpenAI-powered CLI tool for code review and assistance
3. **scripts-python**: Python utility scripts for automation

### Core Functionality

- **Slip Management**: Individual orders that can be grouped into collective orders
- **Order Grouping**: Multiple users can join and share orders
- **Payment Splitting**: Partial or full payments by user or product
- **Real-time Updates**: Chat-like interface for viewing orders
- **Authorization Control**: Slip creators can authorize other users to join
- **Role-based Access**: Support for cliente, mesero, cocina, and admin roles
- **Location Tracking**: Real-time user location management

---

## 🗂️ Repository Structure

```
MeetgarSlips/
├── meetgar-app/                    # Main Next.js application
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   │   ├── (app)/            # Authenticated app routes
│   │   │   ├── api/              # API route handlers
│   │   │   ├── auth/             # Authentication routes
│   │   │   ├── dashboard/        # Dashboard page
│   │   │   ├── login/            # Login page
│   │   │   ├── restaurante/      # Restaurant pages
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── page.tsx          # Home page
│   │   ├── componentes/          # React components
│   │   └── lib/                  # Utilities and configurations
│   │       ├── supabase/         # Supabase client configurations
│   │       ├── database.types.ts # Database type definitions
│   │       └── supabaseClient.ts # Supabase client setup
│   ├── public/                    # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
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

### meetgar-app (Frontend)

- **Framework**: Next.js 15.3.1 (App Router)
- **React**: 19.0.0
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4.1.5
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **State Management**: React Server Components + Client Components
- **Testing**: Vitest 3.1.3
- **Package Manager**: npm (can also use pnpm/yarn/bun)

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

### React/Next.js Patterns

1. **Server Components by Default**: Use React Server Components unless client interactivity is needed
2. **Client Components**: Add `'use client'` directive when needed
3. **Mobile-First Design**: Always design for mobile screens first
4. **Tailwind CSS**: Use utility classes, avoid custom CSS when possible
5. **Supabase Client**:
   - Server components: Use `createSupabaseServerClient()` from `@/lib/supabase/server`
   - Client components: Use `createBrowserClient()` from `@/lib/supabase/client`

### Architecture Principles

1. **No Hydration Errors**: Be careful with server/client component boundaries
2. **Respect Existing Structure**: Don't modify folder structure without justification
3. **Mobile-First**: Primary target is mobile devices (WhatsApp-like UX)
4. **Type Safety**: Always use TypeScript types from `database.types.ts`
5. **Authentication Flow**: Google OAuth → callback → sync user → dashboard

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
   - Follow mobile-first design principles
   - Maintain TypeScript strict mode compliance

3. **Test Your Changes**:
   - Run the dev server and test locally
   - Check for TypeScript errors: `npm run build`
   - Run linter: `npm run lint`
   - Test authentication flows if touching auth

4. **Avoid Common Mistakes**:
   - Don't modify root `page.tsx` unnecessarily (it's the default Next.js template)
   - Don't break the App Router structure
   - Don't introduce hydration errors
   - Don't modify Supabase client configurations without understanding implications
   - Don't commit environment files

### Adding New Features

1. **Database Changes**:
   - Update Supabase schema via Supabase dashboard
   - Regenerate types (if type generation is set up)
   - Update `estructura de tablas supabase.json` if needed

2. **New Pages**:
   - Create in appropriate location under `src/app/`
   - Use Server Components by default
   - Follow existing layout patterns

3. **New Components**:
   - Place in `src/componentes/`
   - Use TypeScript with proper types
   - Follow mobile-first responsive design

4. **New API Routes**:
   - Create in `src/app/api/`
   - Use Supabase server client
   - Handle errors properly
   - Return proper HTTP status codes

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

### Manual Testing Checklist

- [ ] Authentication flow (Google login → callback → dashboard)
- [ ] Mobile responsiveness (test on actual mobile device if possible)
- [ ] Supabase queries (check RLS policies if permission errors)
- [ ] API routes (test with different user roles)
- [ ] Error handling (network errors, auth errors, etc.)

---

## 🔄 Common Patterns

### Supabase Query Pattern (Server Component)

```typescript
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('slips')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    // Handle error
  }

  return (
    // Render data
  )
}
```

### API Route Pattern

```typescript
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Process request
  const body = await request.json()

  // Return response
  return NextResponse.json({ success: true })
}
```

### Mobile-First Tailwind Pattern

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-4">
  {/* Content */}
</div>

// Full width on mobile, fixed width on desktop
<div className="w-full sm:w-auto">
  {/* Content */}
</div>

// Responsive padding
<div className="p-4 sm:p-6 lg:p-8">
  {/* Content */}
</div>
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Hydration Errors**
   - **Cause**: Mismatch between server and client rendering
   - **Solution**: Check for `'use client'` directive, ensure data is consistent

2. **Supabase Auth Errors**
   - **Cause**: Missing environment variables or incorrect configuration
   - **Solution**: Verify `.env.local` has correct Supabase credentials

3. **Import Errors**
   - **Cause**: Incorrect path or missing `@/` alias
   - **Solution**: Use `@/` for imports from `src/`, check tsconfig paths

4. **TypeScript Errors in Database Queries**
   - **Cause**: Database types are out of sync
   - **Solution**: Check `database.types.ts` and update if schema changed

5. **Build Errors**
   - **Cause**: TypeScript strict mode violations
   - **Solution**: Fix type errors, don't use `any`, handle null/undefined properly

6. **API Route 401 Errors**
   - **Cause**: User not authenticated
   - **Solution**: Check auth flow, verify cookies are being passed

### Getting Help

- Check existing documentation files in the repository
- Review recent commit messages for context
- Use the asistente-ia tool for code review
- Test in development mode first before building

---

## 🎯 Quick Reference

### File Locations

| What | Where |
|------|-------|
| React Components | `meetgar-app/src/componentes/` |
| Pages | `meetgar-app/src/app/` |
| API Routes | `meetgar-app/src/app/api/` |
| Supabase Clients | `meetgar-app/src/lib/supabase/` |
| Database Types | `meetgar-app/src/lib/database.types.ts` |
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

### When Assisting with This Codebase

1. **Always prioritize mobile-first design** - This is a mobile app, desktop is secondary
2. **Respect the existing architecture** - Don't restructure unless explicitly asked
3. **Use TypeScript strictly** - No `any` types, handle all nullables
4. **Follow the App Router pattern** - Server Components by default
5. **Check documentation first** - Review relevant .md files before making changes
6. **Test authentication flows** - Many features require authenticated users
7. **Understand the database schema** - Review `estructura de tablas supabase.json`
8. **Don't modify configuration files** without clear justification
9. **Follow git branch naming** - Use `claude/` prefix for feature branches
10. **Be cautious with Supabase clients** - Use the correct client (server vs browser)

### Understanding User Roles

- **cliente**: End user who creates slips and makes orders
- **mesero**: Waiter who manages orders and serves customers
- **cocina**: Kitchen staff who prepare orders
- **admin**: Administrator with full access

### Key Business Logic

- A **slip** is an individual order by one user
- An **order** groups multiple slips together
- Users can request to join an order (requires authorization)
- Payments can be split by product or by user
- Real-time location helps coordinate deliveries
- The UI should feel like WhatsApp (familiar, mobile-native)

---

**End of CLAUDE.md**

> This document is maintained by AI assistants working on the MeetgarSlips codebase. Update it as the project evolves.
