# 📚 README Técnico – Meetgar Slips

Meetgar Slips es una aplicación móvil orientada a restaurantes. Cada "slip" representa una comanda creada por un comensal, que puede agruparse en órdenes colectivas y compartirse entre usuarios. A continuación, se detalla el mapeo entre las **funcionalidades clave** de la app y las **tablas de la base de datos Supabase**.

---

## 🔄 Mapeo Funcionalidades ↔️ Tablas Supabase

### 🧾 Slip como comanda individual
- **Tabla:** `slips`
- **Campos clave:** `id`, `user_id`, `estado`, `comentario`, `order_id`, `restaurante_id`, `creado_en`

---

### 👥 Agrupar slips en una misma orden
- **Tabla:** `orders`
- **Relación:** `slips.order_id` → `orders.id`
- **Tabla de control:** `slip_autorizaciones` (gestiona solicitudes para unirse a órdenes)

---

### 💬 Visualizar slips en interfaz tipo chat
- **Tablas:** `slips` + `slip_productos` + `productos`
- **Lógica:** Agrupar por `order_id` y mostrar slips con productos como mensajes

---

### 💸 Pagos parciales o totales, por usuario o por producto
- **Tabla:** `pagos`
- **Claves:**
  - `slip_producto_id`: producto específico
  - `pagado_por_user_id`: usuario que paga
  - `monto`, `metodo`, `creado_en`

---

### 🔄 Control del estado de cada pedido
- **Tabla:** `slips`
- **Campo:** `estado` (`USER-DEFINED`: `pendiente`, `en_preparacion`, `listo`, `entregado`, `cancelado`, etc.)
- **Tabla adicional:** `orders.estado` (estado global de la orden)

---

### 📍 Registro de ubicación en tiempo real
- **Tabla:** `ubicaciones`
- **Campos:** `user_id`, `latitud`, `longitud`, `actualizado_en`

---

### 🛑 Slip requiere autorización del creador
- **Tabla:** `slip_autorizaciones`
- **Campos:** `solicitante_id`, `order_id`, `estado` (`pendiente`, `aceptado`, `rechazado`)

---

### 📦 Configuración de productos y menú
- **Tabla:** `productos`
- **Campos:** `nombre`, `descripcion`, `precio`, `imagen_url`, `disponible`, `restaurante_id`

---

### 👨‍🍳 Asignar slips a personal (mesero o cocina)
- **Tabla:** `orders`
- **Campo:** `mesero_id` (relación con `users.id` donde `rol = 'mesero'`)

---

### 🕘 Historial de pedidos y pagos
- **Tablas:** `orders`, `slips`, `pagos`
- **Consulta filtrada por:** `creado_en`, `estado`, `restaurante_id`

---

### 🔐 Control de acceso por roles
- **Tabla:** `users`
- **Campo:** `rol` (`USER-DEFINED`: `cliente`, `mesero`, `cocina`, `admin`)

---

### 🔔 Notificaciones y alertas internas
- **Estado actual:** No implementado como tabla. Puede resolverse usando Supabase Realtime + lógica de frontend o una tabla `notificaciones` a futuro.

---

### 📊 Analítica de consumo y facturación
- **Datos fuente:** `slip_productos`, `productos`, `pagos`
- **Indicadores posibles:**
  - Top productos pedidos
  - Tiempo medio de preparación (`creado_en` vs `actualizado_en` en `slips`)
  - Volumen de ventas (suma de `pagos.monto`)

---

## 📌 Notas adicionales
- Todos los IDs son UUID.
- El sistema utiliza `gen_random_uuid()` como default para todas las claves primarias.
- Timestamps (`creado_en`, `actualizado_en`) permiten trazabilidad completa de acciones.

---

> Última actualización del esquema: basada en `estructura de tablas supabase.json`.