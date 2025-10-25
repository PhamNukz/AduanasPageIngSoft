# 🍩 POS Churros - Sistema de Punto de Venta

Sistema de punto de venta completo para carrito de churros. Aplicación web 100% offline con base de datos local.

## 📋 Características Principales

- ✅ **100% Offline**: Funciona completamente sin conexión a internet
- 💾 **Base de datos local**: Usa IndexedDB para almacenamiento persistente
- 🖨️ **Impresión de tickets**: Compatible con impresoras térmicas (58mm/80mm)
- 📊 **Gestión de productos**: CRUD completo y carga masiva por CSV
- 📈 **Historial y arqueo**: Control completo de ventas y reportes
- 🌓 **Modo oscuro**: Interfaz adaptable con tema claro/oscuro
- 💰 **Cálculo automático de IVA**: 19% sobre todos los productos

## 🚀 Instalación

### Opción 1: Servidor Local Simple

1. **Abrir con Live Server** (Recomendado para desarrollo):
   - Si tienes Visual Studio Code, instala la extensión "Live Server"
   - Haz clic derecho en `index.html` y selecciona "Open with Live Server"

2. **Usando Python**:
   ```bash
   # Python 3
   python -m http.server 8000

   # Luego abre en el navegador:
   # http://localhost:8000
   ```

3. **Usando Node.js (http-server)**:
   ```bash
   npx http-server -p 8000

   # Luego abre en el navegador:
   # http://localhost:8000
   ```

### Opción 2: Abrir Directamente

En algunos navegadores modernos puedes abrir el archivo `index.html` directamente, pero esto puede tener limitaciones con IndexedDB. Se recomienda usar un servidor local.

## 👤 Acceso al Sistema

### Usuarios Predefinidos

- **Usuario administrador**: `admin` / `1234`
- **Usuario cajero**: `caja` / `1234`

## 📖 Manual de Uso

### 1. Inicio de Sesión

1. Abre la aplicación en tu navegador
2. Ingresa usuario y contraseña
3. Haz clic en "Iniciar Sesión"

### 2. Crear Nuevo Pedido

1. En el menú lateral, selecciona **"📝 Nuevo Pedido"**
2. Ingresa el **nombre del cliente** (obligatorio)
3. Selecciona un **producto** del menú desplegable
4. Indica la **cantidad**
5. Haz clic en **"Agregar al Pedido"**
6. Repite los pasos 3-5 para agregar más productos
7. Verifica el resumen en el panel derecho:
   - Subtotal sin IVA
   - IVA (19%)
   - Total con IVA
8. Haz clic en **"Finalizar e Imprimir"**
9. Se abrirá el diálogo de impresión automáticamente

**Notas importantes:**
- El botón "Finalizar e Imprimir" solo se activa si hay un nombre de cliente Y productos en el pedido
- Puedes eliminar productos del pedido haciendo clic en ❌
- El botón "Limpiar" borra todo el pedido actual

### 3. Gestión de Productos

#### Agregar Producto Individual

1. Ve a **"🍩 Productos"** en el menú lateral
2. En el panel izquierdo, completa:
   - Nombre del producto
   - Precio en CLP
3. Haz clic en **"Agregar Producto"**

#### Carga Masiva por CSV

1. Prepara un archivo CSV con el formato:
   ```
   nombre,precio
   Churros Rellenos x3,150
   Churros Simples x5,100
   ```

2. En la sección "Carga Masiva (CSV)":
   - Haz clic en "Seleccionar archivo"
   - Selecciona tu archivo CSV
   - Haz clic en **"⚠️ Sobreescribir con CSV"**

**⚠️ IMPORTANTE:** La carga CSV **SOBREESCRIBE** todos los productos existentes. Esta acción no se puede deshacer.

#### Eliminar Producto

1. En la tabla de productos actuales
2. Haz clic en **"Eliminar"** junto al producto
3. Confirma la acción

### 4. Historial y Arqueo

#### Ver Historial de Pedidos

1. Ve a **"📊 Historial y Arqueo"**
2. En la tabla inferior verás todos los pedidos realizados
3. Haz clic en **"Ver Detalle"** para ver la información completa de un pedido

#### Generar Arqueo de Caja

1. En el panel superior, selecciona:
   - **Fecha Inicio**: Fecha inicial del período
   - **Fecha Fin**: Fecha final del período
2. Haz clic en **"Generar Arqueo"**
3. Verás:
   - Total de pedidos en el período
   - Total de dinero recaudado
4. Haz clic en **"Ver Detalle de Pedidos"** para ver todos los pedidos del arqueo

### 5. Cambiar Tema

- En el menú lateral, haz clic en el botón **"☀️ Modo Claro"** o **"🌙 Modo Oscuro"**
- El tema se guarda automáticamente

### 6. Cerrar Sesión

- En el menú lateral, haz clic en **"🚪 Cerrar Sesión"**
- Confirma la acción

## 🖨️ Configuración de Impresión

### Para Impresoras Térmicas

1. **Windows**:
   - Ve a Panel de Control → Dispositivos e impresoras
   - Configura tu impresora térmica como predeterminada
   - Configura el tamaño de papel a 80mm (o el que uses)

2. **Al imprimir desde la aplicación**:
   - El ticket se formatea automáticamente para 80mm
   - El diálogo de impresión se abre automáticamente
   - Verifica que la impresora seleccionada sea la correcta
   - Haz clic en "Imprimir"

### Contenido del Ticket

El ticket incluye:
- 🍩 Logo y nombre del negocio
- ID único del pedido
- Fecha y hora
- **NOMBRE DEL CLIENTE** (en grande y destacado)
- Lista de productos con cantidades
- **NO incluye precios** (solo para cocina)

## 📁 Estructura del Proyecto

```
pos-churros/
├── index.html              # Página de login
├── app.html                # Aplicación principal
├── productos_ejemplo.csv   # Archivo CSV de ejemplo
├── README.md               # Este archivo
├── js/
│   ├── db.js              # Sistema de base de datos (IndexedDB)
│   ├── app.js             # Controlador principal
│   ├── pedidos.js         # Módulo de gestión de pedidos
│   ├── productos.js       # Módulo de gestión de productos
│   └── historial.js       # Módulo de historial y arqueo
└── assets/                # Carpeta para recursos adicionales
```

## 💾 Base de Datos

### Tablas

1. **usuarios**
   - id (PK, autoincrement)
   - username (string, unique)
   - password (string)

2. **productos**
   - id (PK, autoincrement)
   - nombre (string)
   - precio (number)
   - fecha_creacion (ISO string)

3. **pedidos**
   - id (PK, autoincrement)
   - cliente (string)
   - fecha (ISO string)
   - subtotal (number, sin IVA)
   - iva (number, 19%)
   - total (number, con IVA)

4. **detalles_pedido**
   - id (PK, autoincrement)
   - pedido_id (FK → pedidos)
   - producto_id (number)
   - producto_nombre (string)
   - cantidad (number)
   - precio_unitario (number)
   - subtotal (number)

### Ubicación de los Datos

Los datos se almacenan en **IndexedDB** en el navegador:
- Chrome/Edge: `C:\Users\[Usuario]\AppData\Local\Google\Chrome\User Data\Default\IndexedDB`
- Firefox: Perfil de usuario
- Los datos persisten entre sesiones
- Para hacer backup, exporta los pedidos desde el historial

## ⚙️ Especificaciones Técnicas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **UI Framework**: TailwindCSS + DaisyUI (via CDN)
- **Base de datos**: IndexedDB (API nativa del navegador)
- **Compatibilidad**: Navegadores modernos (Chrome, Firefox, Edge)
- **Sin dependencias**: No requiere instalación de paquetes npm

## 🔧 Solución de Problemas

### La base de datos no se inicializa

- Verifica que estés usando un servidor local (no abrir archivo directamente)
- Prueba con otro navegador
- Limpia la caché y los datos del sitio
- Abre la consola de desarrollador (F12) para ver errores

### Los productos no se cargan desde CSV

- Verifica que el formato sea: `nombre,precio`
- Asegúrate de que los precios sean números válidos
- Revisa que el archivo tenga extensión `.csv`
- No debe haber línea de encabezados

### La impresión no funciona

- Verifica que tengas una impresora configurada
- Asegúrate de que el navegador tenga permisos de impresión
- Prueba con otra impresora
- Revisa la configuración de tamaño de papel

### Los datos se pierden al cerrar el navegador

- Verifica que no estés en modo incógnito/privado
- Asegúrate de no limpiar los datos del sitio al cerrar
- Revisa la configuración de privacidad del navegador

## 📝 Notas Importantes

1. **Backup de datos**: Los datos están en el navegador. Si limpias los datos del navegador, SE PERDERÁN todos los pedidos y productos. Se recomienda hacer backup periódico exportando el historial.

2. **Moneda**: Todos los precios están en **Pesos Chilenos (CLP)**

3. **IVA**: El sistema calcula automáticamente el IVA del 19% sobre todos los productos

4. **Seguridad**: Las contraseñas están en texto plano (solo para uso local). No usar para producción sin implementar seguridad adecuada.

5. **Rendimiento**: IndexedDB puede manejar miles de pedidos sin problemas de rendimiento

## 🎯 Flujo de Trabajo Recomendado

1. **Configuración inicial**:
   - Cargar productos (manual o CSV)
   - Verificar que la impresora funcione

2. **Durante el servicio**:
   - Crear pedidos desde "Nuevo Pedido"
   - Cada pedido genera un ticket automáticamente

3. **Al final del día**:
   - Ir a "Historial y Arqueo"
   - Generar arqueo del día
   - Verificar totales

4. **Mantenimiento**:
   - Agregar/eliminar productos según necesidad
   - Revisar historial periódicamente

## 🤝 Soporte

Para problemas o preguntas:
1. Revisa este manual completo
2. Verifica la sección "Solución de Problemas"
3. Revisa la consola del navegador (F12) para errores técnicos

## 📄 Licencia

Este software se proporciona "tal cual" sin garantías de ningún tipo.

---

**Desarrollado para Carrito de Churros** 🍩
Version 1.0 - 2025
