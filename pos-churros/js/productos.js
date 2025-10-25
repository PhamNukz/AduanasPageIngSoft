/**
 * Módulo de Gestión de Productos
 * Maneja el CRUD de productos y la carga masiva por CSV
 */

/**
 * Inicializa el módulo de productos
 */
async function inicializarProductos() {
  // Cargar tabla de productos
  await cargarProductosTabla();

  // Configurar formulario de agregar producto
  document.getElementById('formAgregarProducto').addEventListener('submit', agregarProductoManual);

  // Configurar carga CSV
  document.getElementById('btnCargarCSV').addEventListener('click', cargarProductosCSV);
}

/**
 * Carga y muestra los productos en la tabla
 */
async function cargarProductosTabla() {
  try {
    const productos = await db.obtenerProductos();
    const tbody = document.getElementById('tablaProductos');

    if (productos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-base-content/60">
            No hay productos registrados
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = productos.map(producto => `
      <tr>
        <td>${producto.nombre}</td>
        <td class="font-semibold">${formatoPrecio(producto.precio)}</td>
        <td>
          <button
            class="btn btn-error btn-sm"
            onclick="eliminarProducto(${producto.id}, '${producto.nombre.replace(/'/g, "\\'")}')"
          >
            Eliminar
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar productos:', error);
    mostrarNotificacion('Error al cargar productos', 'error');
  }
}

/**
 * Agrega un producto manualmente
 */
async function agregarProductoManual(e) {
  e.preventDefault();

  const nombre = document.getElementById('productoNombre').value.trim();
  const precio = parseFloat(document.getElementById('productoPrecio').value);

  if (!nombre || precio <= 0) {
    mostrarNotificacion('Por favor complete todos los campos correctamente', 'warning');
    return;
  }

  try {
    await db.agregarProducto({ nombre, precio });

    mostrarNotificacion('Producto agregado exitosamente', 'success');

    // Limpiar formulario
    document.getElementById('formAgregarProducto').reset();

    // Recargar tabla
    await cargarProductosTabla();

    // Actualizar selector en página de pedidos
    await cargarProductosSelect();

  } catch (error) {
    console.error('Error al agregar producto:', error);
    mostrarNotificacion('Error al agregar producto', 'error');
  }
}

/**
 * Elimina un producto
 */
async function eliminarProducto(id, nombre) {
  if (!confirm(`¿Está seguro que desea eliminar el producto "${nombre}"?`)) {
    return;
  }

  try {
    await db.eliminarProducto(id);

    mostrarNotificacion('Producto eliminado exitosamente', 'success');

    // Recargar tabla
    await cargarProductosTabla();

    // Actualizar selector en página de pedidos
    await cargarProductosSelect();

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    mostrarNotificacion('Error al eliminar producto', 'error');
  }
}

/**
 * Carga productos desde un archivo CSV
 */
async function cargarProductosCSV() {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];

  if (!file) {
    mostrarNotificacion('Por favor seleccione un archivo CSV', 'warning');
    return;
  }

  if (!file.name.endsWith('.csv')) {
    mostrarNotificacion('El archivo debe ser un CSV', 'warning');
    return;
  }

  // Confirmación adicional
  if (!confirm('⚠️ ATENCIÓN: Esta acción SOBREESCRIBIRÁ TODOS los productos existentes. ¿Desea continuar?')) {
    return;
  }

  try {
    const contenido = await leerArchivoCSV(file);
    const productos = parsearCSV(contenido);

    if (productos.length === 0) {
      mostrarNotificacion('El archivo CSV está vacío o no tiene el formato correcto', 'error');
      return;
    }

    // Validar productos
    const productosValidos = validarProductosCSV(productos);

    if (productosValidos.length === 0) {
      mostrarNotificacion('No se encontraron productos válidos en el archivo', 'error');
      return;
    }

    // Sobreescribir productos
    await db.sobreescribirProductos(productosValidos);

    mostrarNotificacion(`${productosValidos.length} productos cargados exitosamente`, 'success');

    // Limpiar input de archivo
    fileInput.value = '';

    // Recargar tabla
    await cargarProductosTabla();

    // Actualizar selector en página de pedidos
    await cargarProductosSelect();

  } catch (error) {
    console.error('Error al cargar CSV:', error);
    mostrarNotificacion('Error al procesar el archivo CSV', 'error');
  }
}

/**
 * Lee el contenido de un archivo CSV
 */
function leerArchivoCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject('Error al leer el archivo');

    reader.readAsText(file);
  });
}

/**
 * Parsea el contenido CSV
 */
function parsearCSV(contenido) {
  const lineas = contenido.split('\n').filter(linea => linea.trim());
  const productos = [];

  lineas.forEach((linea, index) => {
    const partes = linea.split(',').map(parte => parte.trim());

    if (partes.length >= 2) {
      const nombre = partes[0];
      const precio = partes[1];

      productos.push({ nombre, precio });
    }
  });

  return productos;
}

/**
 * Valida los productos del CSV
 */
function validarProductosCSV(productos) {
  const validos = [];

  productos.forEach((producto, index) => {
    const nombre = producto.nombre;
    const precio = parseFloat(producto.precio);

    if (nombre && !isNaN(precio) && precio > 0) {
      validos.push({
        nombre: nombre,
        precio: precio
      });
    } else {
      console.warn(`Línea ${index + 1} inválida:`, producto);
    }
  });

  return validos;
}
