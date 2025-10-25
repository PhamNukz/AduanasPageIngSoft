# 🚀 Guía Rápida de Instalación

## Requisitos Previos

- Un navegador moderno (Chrome, Firefox, Edge, etc.)
- Un servidor local simple

## Instalación en 3 Pasos

### 1. Descargar el Proyecto

Descarga o clona este proyecto en tu computadora.

### 2. Iniciar un Servidor Local

Elige una de estas opciones:

#### Opción A: Visual Studio Code (Recomendado)

1. Abre la carpeta `pos-churros` en VS Code
2. Instala la extensión "Live Server"
3. Haz clic derecho en `index.html`
4. Selecciona "Open with Live Server"
5. Se abrirá automáticamente en `http://localhost:5500`

#### Opción B: Python

```bash
# Navega a la carpeta pos-churros
cd pos-churros

# Inicia el servidor (Python 3)
python -m http.server 8000

# Abre en tu navegador:
# http://localhost:8000
```

#### Opción C: Node.js

```bash
# Navega a la carpeta pos-churros
cd pos-churros

# Inicia el servidor
npx http-server -p 8000

# Abre en tu navegador:
# http://localhost:8000
```

#### Opción D: XAMPP/WAMP/MAMP

1. Copia la carpeta `pos-churros` a `htdocs` (XAMPP) o `www` (WAMP)
2. Inicia Apache
3. Abre en tu navegador:
   - `http://localhost/pos-churros`

### 3. Acceder al Sistema

1. Abre tu navegador
2. Ve a la dirección del servidor (ej: `http://localhost:8000`)
3. Usa estas credenciales:
   - Usuario: `admin`
   - Contraseña: `1234`

## ✅ Verificación

Si todo funciona correctamente, deberías ver:

1. ✅ Pantalla de login con logo de churros
2. ✅ Al iniciar sesión, ver el dashboard con sidebar
3. ✅ Productos de ejemplo ya cargados
4. ✅ Puedes crear un pedido de prueba

## 🖨️ Configuración de Impresora (Opcional)

### Para Impresora Térmica

1. **Conecta tu impresora térmica**
2. **Instala los drivers** según el fabricante
3. **Configura en Windows**:
   - Panel de Control → Dispositivos e impresoras
   - Configurar como predeterminada
   - Establecer tamaño de papel: 80mm

4. **Prueba**:
   - Crea un pedido de prueba
   - Haz clic en "Finalizar e Imprimir"
   - Verifica que imprima correctamente

### Para Impresora Normal

El sistema también funciona con impresoras normales (A4). El ticket se imprimirá en formato reducido.

## 🎯 Primer Uso

### Paso 1: Cargar Productos

1. Ve a **"🍩 Productos"**
2. Opción A: Usa el CSV de ejemplo
   - Selecciona `productos_ejemplo.csv`
   - Clic en "Sobreescribir con CSV"
3. Opción B: Agrega productos manualmente

### Paso 2: Crear un Pedido de Prueba

1. Ve a **"📝 Nuevo Pedido"**
2. Ingresa un nombre de cliente: "Cliente Prueba"
3. Selecciona un producto
4. Clic en "Agregar al Pedido"
5. Clic en "Finalizar e Imprimir"
6. Verifica que se abra el diálogo de impresión

### Paso 3: Verificar Historial

1. Ve a **"📊 Historial y Arqueo"**
2. Deberías ver tu pedido de prueba
3. Haz clic en "Ver Detalle" para verificar

## ❗ Problemas Comunes

### Error: "IndexedDB no disponible"

**Solución**: No estás usando un servidor local.
- No abras `index.html` directamente
- Usa una de las opciones de servidor local arriba

### Los productos no aparecen

**Solución**: La base de datos se está inicializando.
- Espera unos segundos
- Recarga la página
- Verifica la consola (F12) para errores

### No se puede imprimir

**Solución**:
- Verifica que tengas una impresora configurada
- Revisa permisos de impresión del navegador
- Prueba con el diálogo de impresión manual (Ctrl+P)

## 🔧 Solución Avanzada

### Limpiar Base de Datos

Si necesitas empezar de cero:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Application" o "Almacenamiento"
3. Busca "IndexedDB"
4. Elimina la base de datos "ChurrosPOS"
5. Recarga la página

### Ver Datos de la Base de Datos

1. F12 → Application → IndexedDB → ChurrosPOS
2. Verás las tablas: usuarios, productos, pedidos, detalles_pedido

## 📱 Uso en Tablet

El sistema es responsive y puede usarse en tablets:

1. Asegúrate de que la tablet esté en la misma red que el servidor
2. Encuentra la IP de tu computadora:
   - Windows: `ipconfig` en CMD
   - Mac/Linux: `ifconfig` en terminal
3. Accede desde la tablet a: `http://[IP]:8000`
   - Ejemplo: `http://192.168.1.100:8000`

## 🎉 ¡Listo!

Si llegaste hasta aquí, tu sistema POS de Churros está funcionando.

**Próximos pasos:**
- Lee el `README.md` para manual completo
- Configura tus productos reales
- Comienza a usarlo en producción

---

**¿Necesitas ayuda?** Revisa `README.md` para más detalles.
