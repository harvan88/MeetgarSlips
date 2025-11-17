# 🏗️ Arquitectura MeetgarSlips - Backend de Lógica de Negocio

> **Documento de Diseño Colaborativo**
> **Estado**: En definición (Fase de ideación)
> **Última actualización**: 2025-11-17

---

## 📋 Índice

1. [Flujo de Usuario Completo](#flujo-de-usuario-completo)
2. [Arquitectura de Componentes](#arquitectura-de-componentes)
3. [APIs Necesarias](#apis-necesarias)
4. [Sistema de Notificaciones](#sistema-de-notificaciones)
5. [Estados y Transiciones](#estados-y-transiciones)
6. [Modelo de Datos](#modelo-de-datos)
7. [Casos de Uso Detallados](#casos-de-uso-detallados)
8. [Decisiones Arquitectónicas](#decisiones-arquitectónicas)

---

## 🎯 Flujo de Usuario Completo

### Paso 1: Llegada al Restaurante
```
Usuario → Mesa → Escanea QR → Redirige a Chat/IA
```

### Paso 2: Interacción con Chat/IA
```
Chat/IA (sistema externo) ↔ MeetgarSlips API
   ↓
Chat solicita: GET /api/menu?restaurante_id=xxx
   ↓
MeetgarSlips responde: { productos: [...], categorías: [...] }
   ↓
Usuario pide productos a través del chat
```

### Paso 3: Creación de Orden
```
Chat/IA → POST /api/slips
   ↓
MeetgarSlips crea slip con productos
   ↓
MeetgarSlips asigna orden (o agrupa con orden existente)
   ↓
Respuesta: { slip_id, order_id, total }
```

### Paso 4: Proceso de Pago
```
Usuario → Realiza pago (externa: MP, transferencia, efectivo)
   ↓
Sistema de pago → POST /api/payments
   ↓
MeetgarSlips registra pago
   ↓
MeetgarSlips actualiza estado del slip
```

### Paso 5: Sistema de Notificaciones (Automático)
```
Evento: "Pago confirmado"
   ↓
MeetgarSlips distribuye notificaciones:
   ├─> Mesero: "Nueva orden en Mesa X"
   ├─> Cocina: "Preparar: 2x Hamburguesa, 1x Pizza"
   ├─> Barra: "Preparar: 2x Coca Cola"
   └─> Caja: "Pago recibido: $5000"
```

### Paso 6: Preparación
```
Cocina → Prepara productos → PUT /api/slips/{id}/status
   ↓
Estado cambia a "listo"
   ↓
Notificaciones automáticas:
   ├─> Mesero: "Orden Mesa X lista para servir"
   └─> Cliente: "Tu pedido está listo"
```

### Paso 7: Entrega
```
Opción A: Mesero lleva a la mesa
   ↓
   Mesero → PUT /api/slips/{id}/status (entregado)

Opción B: Cliente retira en barra
   ↓
   Barra → PUT /api/slips/{id}/status (entregado)
```

---

## 🏛️ Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        SISTEMAS EXTERNOS                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Chat/IA │  │ Frontend │  │  Pagos   │  │   POS    │       │
│  │ (WhatsApp│  │   Web    │  │(MercadoPa│  │ Sistema  │       │
│  │  Telegram)│  │  Mobile  │  │   go)    │  │          │       │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘       │
└────────┼─────────────┼─────────────┼─────────────┼─────────────┘
         │             │             │             │
         └─────────────┴─────────────┴─────────────┘
                       │
         ┌─────────────▼─────────────────────────┐
         │      MEETGARSLIPS BACKEND API          │
         │  (Next.js 15 - API Routes)             │
         │                                        │
         │  ┌──────────────────────────────────┐ │
         │  │     API REST ENDPOINTS            │ │
         │  │  /api/menu                        │ │
         │  │  /api/slips                       │ │
         │  │  /api/orders                      │ │
         │  │  /api/payments                    │ │
         │  │  /api/notifications               │ │
         │  │  /api/products                    │ │
         │  │  /api/stock                       │ │
         │  └──────────────────────────────────┘ │
         │                                        │
         │  ┌──────────────────────────────────┐ │
         │  │   LÓGICA DE NEGOCIO MODULAR       │ │
         │  │                                   │ │
         │  │  ┌────────────┐  ┌─────────────┐ │ │
         │  │  │SlipManager │  │OrderManager │ │ │
         │  │  └────────────┘  └─────────────┘ │ │
         │  │                                   │ │
         │  │  ┌────────────┐  ┌─────────────┐ │ │
         │  │  │PaymentMgr  │  │ProductMgr   │ │ │
         │  │  └────────────┘  └─────────────┘ │ │
         │  │                                   │ │
         │  │  ┌──────────────────────────────┐│ │
         │  │  │  NotificationManager         ││ │
         │  │  │  (Sistema de Distribución)   ││ │
         │  │  └──────────────────────────────┘│ │
         │  └──────────────────────────────────┘ │
         └────────────────┬───────────────────────┘
                          │
         ┌────────────────▼───────────────────────┐
         │      SUPABASE (PostgreSQL)              │
         │                                         │
         │  Tables: users, slips, orders,          │
         │  productos, pagos, notificaciones       │
         │                                         │
         │  Row-Level Security (RLS)               │
         │  Realtime Subscriptions (opcional)      │
         └─────────────────────────────────────────┘
                          │
         ┌────────────────▼───────────────────────┐
         │   CANALES DE NOTIFICACIÓN              │
         │                                         │
         │  ┌──────┐  ┌──────┐  ┌──────┐         │
         │  │ Push │  │Webhook│ │WebSock│         │
         │  │ Notif│  │  API  │ │ et    │         │
         │  └──────┘  └──────┘  └──────┘         │
         └─────────────────────────────────────────┘
```

---

## 🔌 APIs Necesarias

### 1. API de Menú y Productos

#### `GET /api/menu`
**Propósito**: El chat/IA obtiene el menú para mostrarlo al usuario

**Query Parameters**:
```typescript
{
  restaurante_id: string (uuid)
  categoria?: string
  disponible?: boolean
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    restaurante: {
      id: string,
      nombre: string,
      logo_url: string
    },
    categorias: string[],
    productos: [
      {
        id: string,
        nombre: string,
        descripcion: string,
        precio: number,
        imagen_url: string,
        disponible: boolean,
        categoria: string
      }
    ]
  }
}
```

#### `GET /api/products/{id}`
**Propósito**: Detalles de un producto específico

---

### 2. API de Slips (Comandas)

#### `POST /api/slips`
**Propósito**: Crear una nueva comanda

**Request Body**:
```typescript
{
  user_id: string,          // Usuario que hace el pedido
  restaurante_id: string,   // Restaurante
  order_id?: string,        // (Opcional) Para agrupar con orden existente
  productos: [
    {
      producto_id: string,
      cantidad: number,
      comentario?: string   // "Sin cebolla", "Bien cocido", etc.
    }
  ],
  comentario?: string,      // Comentario general del slip
  mesa?: string             // Número de mesa
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    slip_id: string,
    order_id: string,
    total: number,
    estado: "pendiente",
    productos: [...],
    created_at: timestamp
  }
}
```

**Lógica interna**:
1. Validar que productos existen y están disponibles
2. Calcular totales
3. Crear slip en BD
4. Si no tiene order_id, crear nueva orden
5. Asociar slip a orden
6. **NO enviar notificaciones aún** (esperar confirmación de pago)

#### `GET /api/slips/{id}`
**Propósito**: Obtener detalles de un slip

#### `PUT /api/slips/{id}/status`
**Propósito**: Actualizar estado del slip

**Request Body**:
```typescript
{
  estado: "pendiente" | "en_preparacion" | "listo" | "entregado" | "cancelado",
  actualizado_por: string  // user_id de quien actualiza (mesero, cocina, etc.)
}
```

**Lógica interna**:
1. Validar transición de estado válida
2. Actualizar BD
3. **Trigger notificaciones** según el nuevo estado

---

### 3. API de Órdenes

#### `GET /api/orders/{id}`
**Propósito**: Obtener orden completa con todos sus slips

**Response**:
```typescript
{
  success: true,
  data: {
    order_id: string,
    codigo_unico: string,
    estado: string,
    mesa: string,
    slips: [
      {
        slip_id: string,
        user_id: string,
        usuario: { nombre, imagen_url },
        productos: [...],
        total: number,
        estado: string
      }
    ],
    total_general: number,
    creado_en: timestamp
  }
}
```

#### `GET /api/orders?status=pendiente&restaurante_id=xxx`
**Propósito**: Listar órdenes (para meseros, cocina, etc.)

---

### 4. API de Pagos

#### `POST /api/payments`
**Propósito**: Registrar un pago

**Request Body**:
```typescript
{
  slip_id: string,
  monto: number,
  metodo: "efectivo" | "tarjeta" | "transferencia" | "mercadopago",
  pagado_por_user_id: string,
  referencia?: string,      // ID de transacción externa
  slip_producto_ids?: string[]  // (Opcional) Para pagos parciales
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    pago_id: string,
    slip_id: string,
    estado_slip: "pagado",
    monto: number
  }
}
```

**Lógica interna**:
1. Validar que slip existe
2. Validar monto
3. Registrar pago en BD
4. Actualizar estado del slip si está completamente pagado
5. **TRIGGER NOTIFICACIONES**:
   - Mesero: "Pago confirmado Mesa X"
   - Cocina: "Preparar pedido Mesa X"
   - Barra: "Preparar bebidas Mesa X"
   - Caja: "Pago recibido $XXXX"
   - Cliente: "Pago confirmado, tu pedido está en preparación"

---

### 5. API de Notificaciones

#### `POST /api/notifications/send`
**Propósito**: Enviar notificación manual (si es necesario)

#### `GET /api/notifications?user_id=xxx&rol=mesero`
**Propósito**: Obtener notificaciones pendientes para un usuario/rol

**Response**:
```typescript
{
  success: true,
  data: [
    {
      id: string,
      tipo: "slip_created" | "slip_updated" | "payment_received" | "order_ready",
      mensaje: string,
      data: { slip_id, order_id, mesa, ... },
      prioridad: "low" | "medium" | "high",
      leida: boolean,
      creado_en: timestamp
    }
  ]
}
```

#### `PUT /api/notifications/{id}/read`
**Propósito**: Marcar notificación como leída

---

## 🔔 Sistema de Notificaciones

### Arquitectura de Notificaciones

```typescript
// src/lib/notifications/NotificationManager.ts

interface NotificationEvent {
  evento: 'pago_confirmado' | 'slip_listo' | 'slip_entregado' | 'slip_cancelado'
  slip_id: string
  order_id: string
  restaurante_id: string
  mesa?: string
  data: any
}

interface NotificationRule {
  evento: string
  destinatarios: Array<{
    rol: 'cliente' | 'mesero' | 'cocina' | 'caja' | 'barra'
    condicion?: (data: any) => boolean  // Ej: solo si hay productos de cocina
  }>
  prioridad: 'low' | 'medium' | 'high'
  mensaje: (data: any) => string
}
```

### Reglas de Distribución

#### Evento: `pago_confirmado`
```typescript
{
  evento: 'pago_confirmado',
  destinatarios: [
    { rol: 'mesero', mensaje: 'Nueva orden pagada en Mesa {mesa}' },
    {
      rol: 'cocina',
      condicion: (data) => tieneProdutosDeCocina(data),
      mensaje: 'Preparar: {productos_cocina}'
    },
    {
      rol: 'barra',
      condicion: (data) => tieneProductosDeBarra(data),
      mensaje: 'Preparar bebidas: {productos_barra}'
    },
    { rol: 'caja', mensaje: 'Pago recibido: ${monto}' },
    { rol: 'cliente', mensaje: 'Pago confirmado. Tu pedido está en preparación' }
  ],
  prioridad: 'high'
}
```

#### Evento: `slip_listo`
```typescript
{
  evento: 'slip_listo',
  destinatarios: [
    { rol: 'mesero', mensaje: 'Orden Mesa {mesa} lista para servir' },
    { rol: 'cliente', mensaje: 'Tu pedido está listo' }
  ],
  prioridad: 'high'
}
```

#### Evento: `slip_entregado`
```typescript
{
  evento: 'slip_entregado',
  destinatarios: [
    { rol: 'cliente', mensaje: 'Pedido entregado. ¡Buen provecho!' },
    { rol: 'caja', mensaje: 'Orden Mesa {mesa} completada' }
  ],
  prioridad: 'low'
}
```

### Canales de Notificación

```typescript
class NotificationChannel {
  async send(destinatario: User, mensaje: string, data: any) {
    // Implementar según el canal
  }
}

// Canales disponibles
class WebhookChannel extends NotificationChannel {
  // POST a URL del destinatario
}

class PushNotificationChannel extends NotificationChannel {
  // Firebase Cloud Messaging, OneSignal, etc.
}

class WebSocketChannel extends NotificationChannel {
  // WebSocket en tiempo real
}

class DatabaseChannel extends NotificationChannel {
  // Guardar en tabla 'notificaciones' para polling
}
```

---

## 🔄 Estados y Transiciones

### Estados de un Slip

```
[CREADO] → No se usa, pasa directo a pendiente

[PENDIENTE]
   ↓ (pago confirmado)
[PAGADO]
   ↓ (cocina/barra comienza)
[EN_PREPARACION]
   ↓ (cocina/barra termina)
[LISTO]
   ↓ (mesero/cliente retira)
[ENTREGADO]

   ↓ (en cualquier momento antes de entregado)
[CANCELADO]
```

### Transiciones Válidas

```typescript
const TRANSICIONES_VALIDAS = {
  'pendiente': ['pagado', 'cancelado'],
  'pagado': ['en_preparacion', 'cancelado'],
  'en_preparacion': ['listo', 'cancelado'],
  'listo': ['entregado'],
  'entregado': [],  // Estado final
  'cancelado': []   // Estado final
}
```

### Quién Puede Cambiar Estados

```typescript
const PERMISOS_ESTADO = {
  'pendiente → pagado': ['sistema_pago', 'caja'],
  'pagado → en_preparacion': ['cocina', 'barra', 'sistema'],
  'en_preparacion → listo': ['cocina', 'barra'],
  'listo → entregado': ['mesero', 'cliente', 'barra'],
  '* → cancelado': ['admin', 'mesero', 'cliente_creador']
}
```

---

## 💾 Modelo de Datos

### Tablas Principales

#### `slips`
```sql
id                uuid PRIMARY KEY
order_id          uuid REFERENCES orders(id)
user_id           uuid REFERENCES users(id)
restaurante_id    uuid REFERENCES restaurantes(id)
estado            enum (pendiente, pagado, en_preparacion, listo, entregado, cancelado)
comentario        text
mesa              text
creado_en         timestamp
actualizado_en    timestamp
```

#### `slip_productos`
```sql
id                uuid PRIMARY KEY
slip_id           uuid REFERENCES slips(id)
producto_id       uuid REFERENCES productos(id)
cantidad          integer
precio_unitario   numeric
total             numeric
comentario        text  -- "sin cebolla", etc.
asignado_a        text  -- 'cocina' | 'barra'
estado            text  -- para tracking individual si es necesario
```

#### `notificaciones` (nueva tabla)
```sql
id                uuid PRIMARY KEY
tipo              text
destinatario_id   uuid REFERENCES users(id)
rol_destinatario  text  -- 'mesero', 'cocina', 'caja', etc.
slip_id           uuid REFERENCES slips(id)
order_id          uuid REFERENCES orders(id)
mensaje           text
data              jsonb
prioridad         text
leida             boolean DEFAULT false
creado_en         timestamp
```

---

## 📝 Casos de Uso Detallados

### Caso 1: Usuario Hace Pedido Simple

**Secuencia**:
1. Usuario escanea QR → Abre chat
2. Chat: "¡Hola! ¿Qué deseas ordenar?"
3. Usuario: "Quiero una hamburguesa"
4. Chat → `GET /api/menu?restaurante_id=xxx` → Muestra hamburguesas
5. Usuario: "La hamburguesa clásica"
6. Chat → `POST /api/slips` con productos
7. MeetgarSlips crea slip con estado "pendiente"
8. Chat: "Total: $500. ¿Cómo deseas pagar?"
9. Usuario elige método de pago
10. Sistema de pago → `POST /api/payments`
11. MeetgarSlips → **TRIGGER NOTIFICACIONES**:
    - Mesero (pantalla): "Nueva orden Mesa 5"
    - Cocina (pantalla): "Preparar: 1x Hamburguesa Clásica - Mesa 5"
    - Caja: "Pago recibido $500 - Mesa 5"
    - Cliente (chat): "Pago confirmado. Tu pedido está en preparación"

### Caso 2: Grupo de Amigos (Múltiples Slips en una Orden)

**Secuencia**:
1. Usuario A escanea QR → Crea slip → Paga
2. Orden creada: `order_123`
3. Usuario A comparte código de orden con amigos
4. Usuario B: `POST /api/slips` con `order_id=order_123`
5. Usuario C: `POST /api/slips` con `order_id=order_123`
6. Cada slip genera notificaciones independientes
7. Cocina ve 3 slips diferentes pero sabe que son de la misma mesa
8. Mesero puede ver orden completa: `GET /api/orders/order_123`

### Caso 3: Cocina Marca Como Listo

**Secuencia**:
1. Cocina termina de preparar
2. Cocina → `PUT /api/slips/{id}/status` con `estado: "listo"`
3. MeetgarSlips → **TRIGGER NOTIFICACIONES**:
    - Mesero: "Pedido Mesa 5 listo para servir"
    - Cliente: "Tu pedido está listo. El mesero lo llevará a tu mesa"

---

## ✅ SISTEMA ELEGIDO: QR Dinámico + Enlace Compartible

### 🎯 Decisión Final

**Combinación perfecta de seguridad, conveniencia y flexibilidad**

Cuando el primer usuario crea una orden, el sistema genera:
1. **QR Dinámico** - Para escanear desde otro celular
2. **Enlace Compartible** - Para enviar por chat (WhatsApp, Telegram, etc.)

**Ambos apuntan al mismo token único y son igualmente válidos**

### 📱 Flujo de Usuario Completo

#### Primera Persona (Creador de la Orden)

```
1. Usuario A escanea QR de mesa (fijo, impreso en la mesa)
   ↓
2. Chat/IA detecta: "Primera vez en esta mesa"
   ↓
3. POST /api/orders
   {
     user_id: "user_a",
     restaurante_id: "rest_123",
     mesa: "5"
   }
   ↓
4. MeetgarSlips crea orden y genera token único
   ↓
5. Response:
   {
     order_id: "order_abc123",
     token: "tok_xyz789_secure_random",
     join_url: "https://meetgar.app/join/tok_xyz789_secure_random",
     qr_data: "https://meetgar.app/join/tok_xyz789_secure_random",
     expires_at: "2025-11-18T15:30:00Z"  // 24 horas
   }
   ↓
6. Chat muestra al usuario:
   ┌─────────────────────────────────────┐
   │  Tu Mesa 5 - Orden Creada          │
   │                                     │
   │  Invita a tus amigos:              │
   │                                     │
   │  [QR CODE AQUÍ]                    │
   │                                     │
   │  O comparte este enlace:           │
   │  https://meetgar.app/join/tok_...  │
   │  [📋 Copiar] [📤 Compartir]        │
   └─────────────────────────────────────┘
```

#### Segunda Persona (Se Une a la Orden)

**Opción A: Escanea QR**
```
1. Usuario B escanea QR mostrado en celular de Usuario A
   ↓
2. Browser abre: https://meetgar.app/join/tok_xyz789_secure_random
   ↓
3. Redirige al chat con token en URL
   ↓
4. Chat detecta token → POST /api/orders/join
   {
     token: "tok_xyz789_secure_random",
     user_id: "user_b"
   }
   ↓
5. MeetgarSlips valida token y asocia user_b a order_abc123
   ↓
6. Chat: "¡Te has unido a la orden de Mesa 5! ¿Qué deseas ordenar?"
```

**Opción B: Recibe Enlace por Chat**
```
1. Usuario A comparte enlace por WhatsApp a Usuario B
   ↓
2. Usuario B hace clic en el enlace
   ↓
3. [Mismo flujo que Opción A desde paso 2]
```

### 🔧 Implementación Técnica

#### 1. API para Crear Orden

```typescript
// POST /api/orders
export async function POST(request: Request) {
  try {
    const { user_id, restaurante_id, mesa } = await request.json()

    // Crear orden
    const order = await createOrder({ user_id, restaurante_id, mesa })

    // Generar token único y seguro
    const token = generateSecureToken() // crypto.randomBytes(32).toString('hex')

    // Guardar token con expiración
    await supabase.from('order_join_tokens').insert({
      order_id: order.id,
      token,
      created_by: user_id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    })

    // Generar URL de join
    const join_url = `${BASE_URL}/join/${token}`

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        token,
        join_url,
        qr_data: join_url,  // Mismo URL para QR
        expires_at: expires_at
      }
    })
  } catch (error) {
    // ...
  }
}
```

#### 2. Tabla de Tokens

```sql
CREATE TABLE order_join_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  token text UNIQUE NOT NULL,
  created_by uuid REFERENCES users(id),
  expires_at timestamp NOT NULL,
  max_uses integer DEFAULT NULL,  -- NULL = ilimitado
  times_used integer DEFAULT 0,
  revoked boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Índice para búsqueda rápida por token
CREATE INDEX idx_order_join_tokens_token ON order_join_tokens(token);

-- Índice para limpieza de tokens expirados
CREATE INDEX idx_order_join_tokens_expires ON order_join_tokens(expires_at);
```

#### 3. API para Unirse a Orden

```typescript
// POST /api/orders/join
export async function POST(request: Request) {
  try {
    const { token, user_id } = await request.json()

    // 1. Validar token
    const { data: tokenData, error } = await supabase
      .from('order_join_tokens')
      .select('*, orders(*)')
      .eq('token', token)
      .eq('revoked', false)
      .single()

    if (error || !tokenData) {
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // 2. Verificar expiración
    if (new Date() > new Date(tokenData.expires_at)) {
      return NextResponse.json(
        { success: false, error: 'El enlace ha expirado' },
        { status: 400 }
      )
    }

    // 3. Verificar límite de usos (si aplica)
    if (tokenData.max_uses && tokenData.times_used >= tokenData.max_uses) {
      return NextResponse.json(
        { success: false, error: 'El enlace alcanzó el límite de usos' },
        { status: 400 }
      )
    }

    // 4. Asociar usuario a la orden
    await supabase.from('order_participants').insert({
      order_id: tokenData.order_id,
      user_id: user_id,
      joined_via: 'token'
    })

    // 5. Incrementar contador de usos
    await supabase
      .from('order_join_tokens')
      .update({ times_used: tokenData.times_used + 1 })
      .eq('id', tokenData.id)

    // 6. Retornar información de la orden
    return NextResponse.json({
      success: true,
      data: {
        order_id: tokenData.order_id,
        mesa: tokenData.orders.mesa,
        restaurante_id: tokenData.orders.restaurante_id
      }
    })

  } catch (error) {
    // ...
  }
}
```

#### 4. Ruta de Redirección (Opcional)

```typescript
// src/app/join/[token]/route.ts
// Redirige al chat con el token
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const token = params.token

  // Redirigir al sistema de chat con token
  const chatUrl = `${CHAT_BASE_URL}?join_token=${token}`

  return NextResponse.redirect(chatUrl)
}
```

#### 5. Gestión de Tokens

```typescript
// API para revocar token (creador puede cancelar el enlace)
// PUT /api/orders/{order_id}/revoke-token
export async function PUT(request: Request) {
  // Validar que el usuario es el creador
  // Marcar token como revoked
}

// Cronjob para limpiar tokens expirados
// Ejecutar diariamente
export async function cleanupExpiredTokens() {
  await supabase
    .from('order_join_tokens')
    .delete()
    .lt('expires_at', new Date().toISOString())
}
```

### 🔒 Seguridad

1. **Tokens Únicos y Aleatorios**: Usar `crypto.randomBytes()` para generar tokens impredecibles
2. **Expiración Automática**: Tokens válidos por 24 horas
3. **Revocación**: Creador puede revocar el enlace en cualquier momento
4. **Límite de Usos** (opcional): Limitar a X personas que pueden unirse
5. **HTTPS Obligatorio**: Todos los enlaces deben ser HTTPS
6. **Rate Limiting**: Limitar intentos de join por IP

### ✅ Ventajas de Esta Solución

1. **Máxima Flexibilidad**: Usuario elige QR o enlace según convenga
2. **Muy Conveniente**: Compartir por WhatsApp es natural y fácil
3. **Seguro**: Token único imposible de adivinar
4. **No Requiere Memorizar Nada**: El enlace se comparte automáticamente
5. **Experiencia Móvil Nativa**: Click en enlace = unirse inmediatamente
6. **Escalable**: Misma lógica sirve para cualquier cantidad de usuarios
7. **Revocable**: Creador puede cancelar acceso si es necesario

---

## 🎯 Decisiones Arquitectónicas

### ✅ Decisiones Tomadas

1. **Next.js como Backend API**: Usar Next.js exclusivamente para sus capacidades de backend
2. **Supabase para BD y Auth**: PostgreSQL con Row-Level Security
3. **Sistema de Notificaciones Asíncrono**: No bloquear las respuestas de API
4. **Estado en Base de Datos**: BD como única fuente de verdad
5. **APIs REST**: Comunicación stateless con clientes externos
6. **✨ Asociación de Usuarios a Órdenes**: **QR Dinámico + Enlace Compartible**
   - Primera persona escanea QR de mesa → Crea orden → Sistema genera QR + Enlace
   - Usuario puede mostrar QR en pantalla O compartir enlace por chat
   - Enlace incluye token único: `https://meetgar.app/join/{token}`
   - Token válido por 24 horas
7. **✨ Notificaciones**: **Webhooks con Retry + Fallback Polling**
   - Sistema envía webhooks a URLs registradas
   - Retry 3 veces con exponential backoff (1s, 5s, 15s)
   - Si falla, guardar en tabla `webhook_failed_deliveries`
   - Sistemas externos pueden hacer polling como backup

### ⏳ Decisiones Pendientes

- [ ] **Autenticación de clientes**: ¿Anónimos con sesión o login con Google/email?
- [ ] **Manejo de productos compartidos**: ¿Cómo dividir "1 pizza entre 3 personas"?
- [ ] **Tracking de ubicación**: ¿Es necesario si todo es por mesa?
- [ ] **Integración con sistemas de pago**: ¿MercadoPago, Stripe, otros?
- [ ] **Reportes y analítica**: ¿En este módulo o módulo separado?
- [ ] **Control de stock en tiempo real**: ¿Necesario o suficiente con flag `disponible`?

### 🤔 Preguntas para Definir (Actualizadas)

1. ~~**Notificaciones en tiempo real**~~ - ✅ **RESUELTO**: Webhooks con retry
2. ~~**Identificación de mesas**~~ - ✅ **RESUELTO**: QR de mesa incluye número, token para unirse
3. **Autenticación de usuarios**: ¿Los clientes se autentican o son anónimos?
4. **Cancelaciones**: ¿Quién puede cancelar un pedido ya pagado?
5. **Stock**: ¿Controlar disponibilidad en tiempo real o confiar en flag `disponible`?

---

## 🚀 Próximos Pasos

### Inmediatos (Diseño)
1. ✅ **Definir sistema de asociación de usuarios** - COMPLETADO (QR + Enlace)
2. ✅ **Definir sistema de notificaciones** - COMPLETADO (Webhooks con retry)
3. **Definir autenticación de clientes** - PENDIENTE
4. **Definir manejo de productos compartidos** - PENDIENTE
5. **Actualizar modelo de datos con nuevas tablas**:
   - `order_join_tokens`
   - `order_participants`
   - `webhook_subscriptions`
   - `webhook_failed_deliveries`

### Siguientes (Implementación)
1. **Implementar endpoints core**:
   - `POST /api/orders` (con generación de token)
   - `POST /api/orders/join`
   - `POST /api/webhooks/subscribe`
   - `POST /api/payments` (con trigger de webhooks)
2. **Implementar Event Manager + Webhook Dispatcher**
3. **Crear estructura de carpetas modular**:
   - `src/lib/business-logic/orders/`
   - `src/lib/business-logic/slips/`
   - `src/lib/webhooks/`
   - `src/lib/events/`
4. **Testing de flujos principales**
5. **Documentar APIs con ejemplos de request/response**

---

**Documento vivo**: Este documento será actualizado conforme refinamos la arquitectura.
