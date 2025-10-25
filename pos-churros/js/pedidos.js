/**
 * Módulo de Gestión de Pedidos
 * Maneja la creación de nuevos pedidos y el carrito
 */

// Carrito de compras actual
let carritoActual = [];
let productosDisponibles = [];

/**
 * Inicializa el módulo de pedidos
 */
async function inicializarPedidos() {
  // Cargar productos para el selector
  await cargarProductosSelect();

  // Configurar formulario de nuevo pedido
  document.getElementById('formNuevoPedido').addEventListener('submit', agregarProductoAlPedido);

  // Configurar botones
  document.getElementById('btnLimpiarPedido').addEventListener('click', limpiarPedido);
  document.getElementById('btnFinalizarPedido').addEventListener('click', finalizarPedido);
}

/**
 * Carga los productos en el selector
 */
async function cargarProductosSelect() {
  try {
    productosDisponibles = await db.obtenerProductos();

    const select = document.getElementById('productoSelect');
    select.innerHTML = '<option value="">Seleccione un producto...</option>';

    productosDisponibles.forEach(producto => {
      const option = document.createElement('option');
      option.value = producto.id;
      option.textContent = `${producto.nombre} - ${formatoPrecio(producto.precio)}`;
      option.dataset.nombre = producto.nombre;
      option.dataset.precio = producto.precio;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    mostrarNotificacion('Error al cargar productos', 'error');
  }
}

/**
 * Agrega un producto al pedido actual
 */
function agregarProductoAlPedido(e) {
  e.preventDefault();

  const select = document.getElementById('productoSelect');
  const cantidad = parseInt(document.getElementById('productoCantidad').value);

  if (!select.value) {
    mostrarNotificacion('Por favor seleccione un producto', 'warning');
    return;
  }

  if (cantidad < 1) {
    mostrarNotificacion('La cantidad debe ser mayor a 0', 'warning');
    return;
  }

  const opcionSeleccionada = select.options[select.selectedIndex];
  const producto = {
    producto_id: parseInt(select.value),
    producto_nombre: opcionSeleccionada.dataset.nombre,
    precio_unitario: parseFloat(opcionSeleccionada.dataset.precio),
    cantidad: cantidad,
    subtotal: parseFloat(opcionSeleccionada.dataset.precio) * cantidad
  };

  // Verificar si el producto ya está en el carrito
  const indexExistente = carritoActual.findIndex(item => item.producto_id === producto.producto_id);

  if (indexExistente >= 0) {
    // Actualizar cantidad
    carritoActual[indexExistente].cantidad += cantidad;
    carritoActual[indexExistente].subtotal =
      carritoActual[indexExistente].precio_unitario * carritoActual[indexExistente].cantidad;
  } else {
    // Agregar nuevo producto
    carritoActual.push(producto);
  }

  // Actualizar interfaz
  actualizarResumenPedido();

  // Limpiar formulario
  select.value = '';
  document.getElementById('productoCantidad').value = 1;

  mostrarNotificacion('Producto agregado al pedido', 'success');
}

/**
 * Actualiza el resumen del pedido
 */
function actualizarResumenPedido() {
  const tbody = document.getElementById('listaItemsPedido');

  if (carritoActual.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-base-content/60">
          No hay productos en el pedido
        </td>
      </tr>
    `;
    document.getElementById('subtotalPedido').textContent = formatoPrecio(0);
    document.getElementById('ivaPedido').textContent = formatoPrecio(0);
    document.getElementById('totalPedido').textContent = formatoPrecio(0);
    document.getElementById('btnFinalizarPedido').disabled = true;
    return;
  }

  // Calcular totales
  const subtotalSinIva = carritoActual.reduce((sum, item) => sum + item.subtotal, 0);
  const subtotalConIva = subtotalSinIva / 1.19; // Subtotal sin IVA
  const iva = subtotalSinIva - subtotalConIva; // IVA (19%)
  const total = subtotalSinIva;

  // Renderizar items
  tbody.innerHTML = carritoActual.map((item, index) => `
    <tr>
      <td>${item.producto_nombre}</td>
      <td>${item.cantidad}</td>
      <td>${formatoPrecio(item.precio_unitario)}</td>
      <td class="font-semibold">${formatoPrecio(item.subtotal)}</td>
      <td>
        <button class="btn btn-ghost btn-xs text-error" onclick="eliminarItemPedido(${index})">
          ❌
        </button>
      </td>
    </tr>
  `).join('');

  // Actualizar totales
  document.getElementById('subtotalPedido').textContent = formatoPrecio(subtotalConIva);
  document.getElementById('ivaPedido').textContent = formatoPrecio(iva);
  document.getElementById('totalPedido').textContent = formatoPrecio(total);

  // Habilitar botón finalizar
  const clienteNombre = document.getElementById('clienteNombre').value.trim();
  document.getElementById('btnFinalizarPedido').disabled = !clienteNombre;
}

/**
 * Elimina un item del pedido
 */
function eliminarItemPedido(index) {
  carritoActual.splice(index, 1);
  actualizarResumenPedido();
  mostrarNotificacion('Producto eliminado del pedido', 'info');
}

/**
 * Limpia el pedido actual
 */
function limpiarPedido() {
  if (carritoActual.length === 0) return;

  if (confirm('¿Está seguro que desea limpiar el pedido actual?')) {
    carritoActual = [];
    document.getElementById('clienteNombre').value = '';
    actualizarResumenPedido();
    mostrarNotificacion('Pedido limpiado', 'info');
  }
}

/**
 * Finaliza el pedido y lo guarda en la base de datos
 */
async function finalizarPedido() {
  const clienteNombre = document.getElementById('clienteNombre').value.trim();

  if (!clienteNombre) {
    mostrarNotificacion('Por favor ingrese el nombre del cliente', 'warning');
    return;
  }

  if (carritoActual.length === 0) {
    mostrarNotificacion('No hay productos en el pedido', 'warning');
    return;
  }

  if (!confirm('¿Desea finalizar e imprimir este pedido?')) {
    return;
  }

  try {
    // Calcular totales
    const subtotalSinIva = carritoActual.reduce((sum, item) => sum + item.subtotal, 0);
    const subtotalReal = subtotalSinIva / 1.19;
    const iva = subtotalSinIva - subtotalReal;

    // Crear pedido
    const pedido = {
      cliente: clienteNombre,
      subtotal: subtotalReal,
      iva: iva,
      total: subtotalSinIva,
      items: carritoActual
    };

    const pedidoId = await db.crearPedido(pedido);

    mostrarNotificacion('Pedido creado exitosamente', 'success');

    // Imprimir ticket
    imprimirTicket(pedidoId, clienteNombre, carritoActual);

    // Limpiar formulario
    carritoActual = [];
    document.getElementById('clienteNombre').value = '';
    actualizarResumenPedido();

  } catch (error) {
    console.error('Error al finalizar pedido:', error);
    mostrarNotificacion('Error al crear el pedido', 'error');
  }
}

/**
 * Imprime el ticket del pedido
 */
function imprimirTicket(pedidoId, cliente, items) {
  const printArea = document.getElementById('printArea');

  // Generar HTML del ticket
  const ticketHTML = `
    <div style="font-family: 'Courier New', monospace; width: 80mm; padding: 10px; font-size: 12px;">
      <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
        <h1 style="font-size: 24px; margin: 0;">🍩 CHURROS POS</h1>
        <p style="margin: 5px 0;">Ticket de Cocina</p>
      </div>

      <div style="margin: 15px 0; border-bottom: 2px dashed #000; padding-bottom: 10px;">
        <p style="margin: 5px 0;"><strong>ID Pedido:</strong> #${pedidoId}</p>
        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formatoFecha(new Date().toISOString())}</p>
      </div>

      <div style="margin: 20px 0; text-align: center; border: 3px solid #000; padding: 15px; background: #f0f0f0;">
        <h2 style="font-size: 28px; margin: 0; text-transform: uppercase;">
          ${cliente}
        </h2>
      </div>

      <div style="margin: 15px 0; border-bottom: 2px dashed #000; padding-bottom: 10px;">
        <h3 style="font-size: 16px; margin-bottom: 10px;">PRODUCTOS:</h3>
        ${items.map(item => `
          <div style="margin: 8px 0; display: flex; justify-content: space-between;">
            <div>
              <strong>${item.cantidad}x</strong> ${item.producto_nombre}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align: center; margin-top: 20px; font-size: 10px;">
        <p>¡Gracias por su preferencia!</p>
      </div>
    </div>
  `;

  printArea.innerHTML = ticketHTML;
  printArea.style.display = 'block';

  // Imprimir
  setTimeout(() => {
    window.print();
    printArea.style.display = 'none';
  }, 500);
}

// Habilitar el botón de finalizar cuando se ingresa el nombre del cliente
document.addEventListener('DOMContentLoaded', () => {
  const clienteInput = document.getElementById('clienteNombre');
  if (clienteInput) {
    clienteInput.addEventListener('input', () => {
      const clienteNombre = clienteInput.value.trim();
      const btnFinalizar = document.getElementById('btnFinalizarPedido');
      btnFinalizar.disabled = !clienteNombre || carritoActual.length === 0;
    });
  }
});
