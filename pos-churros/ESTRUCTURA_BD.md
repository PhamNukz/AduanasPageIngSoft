# 💾 Estructura de Base de Datos - POS Churros

## Información General

- **Motor**: IndexedDB (Base de datos NoSQL del navegador)
- **Nombre**: ChurrosPOS
- **Versión**: 1
- **Ubicación**: Almacenamiento local del navegador

## Tablas (Object Stores)

### 1. usuarios

Almacena los usuarios del sistema.

```javascript
{
  keyPath: 'id',
  autoIncrement: true
}
```

#### Índices
- `username` (único)

#### Campos

| Campo    | Tipo   | Descripción                | Ejemplo  |
|----------|--------|----------------------------|----------|
| id       | number | ID autoincremental (PK)    | 1        |
| username | string | Nombre de usuario (único)  | "admin"  |
| password | string | Contraseña (texto plano)   | "1234"   |

#### Datos Iniciales

```javascript
{ id: 1, username: 'admin', password: '1234' }
{ id: 2, username: 'caja', password: '1234' }
```

⚠️ **Nota**: Las contraseñas están en texto plano. Esta implementación es solo para uso local. No usar en producción sin encriptación.

---

### 2. productos

Almacena el catálogo de productos disponibles.

```javascript
{
  keyPath: 'id',
  autoIncrement: true
}
```

#### Índices
- `nombre`

#### Campos

| Campo          | Tipo   | Descripción                    | Ejemplo                |
|----------------|--------|--------------------------------|------------------------|
| id             | number | ID autoincremental (PK)        | 1                      |
| nombre         | string | Nombre del producto            | "Churros Rellenos x3"  |
| precio         | number | Precio en CLP                  | 150                    |
| fecha_creacion | string | Fecha de creación (ISO 8601)   | "2025-01-15T10:30:00Z" |

#### Datos Iniciales

```javascript
{ id: 1, nombre: 'Churros Rellenos x3', precio: 150, fecha_creacion: '...' }
{ id: 2, nombre: 'Churros Rellenos x6', precio: 280, fecha_creacion: '...' }
{ id: 3, nombre: 'Churros Simples x5', precio: 100, fecha_creacion: '...' }
{ id: 4, nombre: 'Chocolate Caliente', precio: 80, fecha_creacion: '...' }
```

---

### 3. pedidos

Almacena la información general de cada pedido.

```javascript
{
  keyPath: 'id',
  autoIncrement: true
}
```

#### Índices
- `fecha`
- `cliente`

#### Campos

| Campo    | Tipo   | Descripción                    | Ejemplo                |
|----------|--------|--------------------------------|------------------------|
| id       | number | ID autoincremental (PK)        | 1                      |
| cliente  | string | Nombre del cliente             | "Juan Pérez"           |
| fecha    | string | Fecha del pedido (ISO 8601)    | "2025-01-15T14:30:00Z" |
| subtotal | number | Subtotal SIN IVA (CLP)         | 252.10                 |
| iva      | number | IVA 19% (CLP)                  | 47.90                  |
| total    | number | Total CON IVA (CLP)            | 300.00                 |

#### Ejemplo de Registro

```javascript
{
  id: 1,
  cliente: "Juan Pérez",
  fecha: "2025-01-15T14:30:00.123Z",
  subtotal: 252.10,  // Total / 1.19
  iva: 47.90,        // Total - Subtotal
  total: 300.00      // Suma de todos los items
}
```

#### Cálculo de IVA

El sistema usa la siguiente fórmula:

```
Total (con IVA) = Suma de todos los items
Subtotal (sin IVA) = Total / 1.19
IVA (19%) = Total - Subtotal
```

---

### 4. detalles_pedido

Almacena los productos de cada pedido (líneas del pedido).

```javascript
{
  keyPath: 'id',
  autoIncrement: true
}
```

#### Índices
- `pedido_id`

#### Campos

| Campo           | Tipo   | Descripción                    | Ejemplo                |
|-----------------|--------|--------------------------------|------------------------|
| id              | number | ID autoincremental (PK)        | 1                      |
| pedido_id       | number | ID del pedido (FK)             | 1                      |
| producto_id     | number | ID del producto                | 1                      |
| producto_nombre | string | Nombre del producto            | "Churros Rellenos x3"  |
| cantidad        | number | Cantidad solicitada            | 2                      |
| precio_unitario | number | Precio unitario en ese momento | 150                    |
| subtotal        | number | Cantidad × Precio unitario     | 300                    |

#### Ejemplo de Registro

```javascript
{
  id: 1,
  pedido_id: 1,
  producto_id: 1,
  producto_nombre: "Churros Rellenos x3",
  cantidad: 2,
  precio_unitario: 150,
  subtotal: 300  // 2 × 150
}
```

⚠️ **Nota**: Se guarda el `producto_nombre` y `precio_unitario` en el momento del pedido para mantener un historial preciso, incluso si el producto se modifica o elimina posteriormente.

---

## Relaciones

```
usuarios (1) ─────┐
                  │ (no implementada)
                  │
pedidos (1) ──────┴─── (muchos) detalles_pedido
                  │
                  │
productos (1) ────┘ (referencia débil)
```

### Relación pedidos ↔ detalles_pedido

- **Tipo**: Uno a muchos
- **Clave foránea**: `detalles_pedido.pedido_id → pedidos.id`
- **Implementación**: Manual (IndexedDB no soporta FK automáticas)

### Relación productos ↔ detalles_pedido

- **Tipo**: Referencia débil
- **Campo**: `detalles_pedido.producto_id`
- **Nota**: Se guarda también el nombre y precio en `detalles_pedido` para preservar el historial

---

## Operaciones CRUD

### Usuarios

#### Leer (verificar credenciales)
```javascript
await db.verificarUsuario(username, password)
```

---

### Productos

#### Crear
```javascript
await db.agregarProducto({ nombre, precio })
```

#### Leer todos
```javascript
const productos = await db.obtenerProductos()
```

#### Eliminar
```javascript
await db.eliminarProducto(id)
```

#### Sobreescribir (CSV)
```javascript
await db.sobreescribirProductos([
  { nombre: 'Producto 1', precio: 100 },
  { nombre: 'Producto 2', precio: 200 }
])
```

---

### Pedidos

#### Crear (con detalles)
```javascript
const pedido = {
  cliente: 'Juan Pérez',
  subtotal: 252.10,
  iva: 47.90,
  total: 300,
  items: [
    {
      producto_id: 1,
      producto_nombre: 'Churros Rellenos x3',
      cantidad: 2,
      precio_unitario: 150,
      subtotal: 300
    }
  ]
}

const pedidoId = await db.crearPedido(pedido)
```

#### Leer todos
```javascript
const pedidos = await db.obtenerPedidos()
```

#### Leer por rango de fechas
```javascript
const fechaInicio = new Date('2025-01-01')
const fechaFin = new Date('2025-01-31')
const pedidos = await db.obtenerPedidosPorRango(fechaInicio, fechaFin)
```

---

### Detalles de Pedido

#### Leer por pedido
```javascript
const detalles = await db.obtenerDetallesPedido(pedidoId)
```

---

## Migración y Backup

### Exportar Datos

Los datos están en IndexedDB del navegador. Para hacer backup:

1. **Opción 1: Manualmente desde DevTools**
   - F12 → Application → IndexedDB → ChurrosPOS
   - Copia los datos manualmente

2. **Opción 2: Programáticamente** (futuro)
   - Implementar exportación a JSON
   - Implementar exportación a CSV

### Importar Datos

Actualmente solo disponible para productos vía CSV.

### Limpiar Base de Datos

```javascript
// En la consola del navegador
indexedDB.deleteDatabase('ChurrosPOS')
// Luego recargar la página
```

---

## Consideraciones de Rendimiento

### Índices

Se crearon índices en:
- `usuarios.username` → Búsqueda rápida en login
- `productos.nombre` → Búsqueda de productos
- `pedidos.fecha` → Filtrado por fechas (arqueo)
- `pedidos.cliente` → Búsqueda por cliente
- `detalles_pedido.pedido_id` → JOIN con pedidos

### Límites

IndexedDB puede manejar:
- ✅ Miles de productos sin problemas
- ✅ Decenas de miles de pedidos
- ✅ Cientos de miles de detalles

Para un carrito de churros, estos límites son más que suficientes.

### Optimizaciones

- Los productos se cargan una sola vez al inicio
- Las consultas usan índices para mayor velocidad
- Los pedidos se ordenan por fecha en el cliente (no requiere índice ordenado)

---

## Versionado de la Base de Datos

### Versión Actual: 1

Si en el futuro se necesitan cambios en la estructura:

```javascript
const DB_VERSION = 2  // Incrementar versión

request.onupgradeneeded = (event) => {
  const db = event.target.result
  const oldVersion = event.oldVersion

  if (oldVersion < 2) {
    // Migración de v1 a v2
    // Agregar nuevas tablas o campos aquí
  }
}
```

---

## Diagrama ER Simplificado

```
┌──────────────┐
│  usuarios    │
├──────────────┤
│ id (PK)      │
│ username     │
│ password     │
└──────────────┘

┌──────────────┐
│  productos   │
├──────────────┤
│ id (PK)      │
│ nombre       │
│ precio       │
│ fecha_creac. │
└──────────────┘

┌──────────────────┐         ┌─────────────────────┐
│  pedidos         │         │  detalles_pedido    │
├──────────────────┤         ├─────────────────────┤
│ id (PK)          │────┬────│ id (PK)             │
│ cliente          │    │    │ pedido_id (FK)      │
│ fecha            │    └───>│ producto_id         │
│ subtotal         │         │ producto_nombre     │
│ iva              │         │ cantidad            │
│ total            │         │ precio_unitario     │
└──────────────────┘         │ subtotal            │
                             └─────────────────────┘
```

---

## Seguridad

⚠️ **Advertencias de Seguridad**:

1. **Contraseñas en texto plano**: Solo para uso local
2. **Sin encriptación**: Los datos en IndexedDB no están encriptados
3. **Acceso local**: Cualquiera con acceso al navegador puede ver los datos
4. **Sin autenticación de sesión robusta**: Solo sessionStorage

Para uso en producción real, se recomienda:
- Implementar hash de contraseñas (bcrypt, scrypt)
- Usar tokens JWT para sesiones
- Implementar permisos por rol
- Encriptar datos sensibles

---

**Última actualización**: Enero 2025
