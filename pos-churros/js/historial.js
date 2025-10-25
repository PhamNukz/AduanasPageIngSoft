/**
 * Módulo de Historial y Arqueo
 * Maneja el historial de pedidos y generación de arqueos
 */

let pedidosArqueoActual = [];

/**
 * Inicializa el módulo de historial
 */
async function inicializarHistorial() {
  // Cargar historial de pedidos
  await cargarHistorial();

  // Configurar generador de arqueo
  document.getElementById('btnGenerarArqueo').addEventListener('click', generarArqueo);

  // Configurar toggle de detalle de arqueo
  document.getElementById('btnToggleDetalleArqueo').addEventListener('click', toggleDetalleArqueo);

  // Establecer fechas por defecto (hoy)
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('fechaInicio').value = hoy;
  document.getElementById('fechaFin').value = hoy;
}

/**
 * Carga el historial completo de pedidos
 */
async function cargarHistorial() {
  try {
    const pedidos = await db.obtenerPedidos();
    const tbody = document.getElementById('tablaHistorial');

    if (pedidos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-base-content/60">
            No hay pedidos registrados
          </td>
        </tr>
      `;
      return;
    }

    // Ordenar pedidos por fecha (más reciente primero)
    pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    tbody.innerHTML = pedidos.map(pedido => `
      <tr>
        <td class="font-semibold">#${pedido.id}</td>
        <td>${pedido.cliente}</td>
        <td>${formatoFecha(pedido.fecha)}</td>
        <td class="font-semibold text-success">${formatoPrecio(pedido.total)}</td>
        <td>
          <button
            class="btn btn-info btn-sm"
            onclick="verDetallePedido(${pedido.id})"
          >
            Ver Detalle
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar historial:', error);
    mostrarNotificacion('Error al cargar historial', 'error');
  }
}

/**
 * Muestra el detalle de un pedido en un modal
 */
async function verDetallePedido(pedidoId) {
  try {
    // Obtener todos los pedidos para encontrar el específico
    const pedidos = await db.obtenerPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);

    if (!pedido) {
      mostrarNotificacion('Pedido no encontrado', 'error');
      return;
    }

    // Obtener detalles del pedido
    const detalles = await db.obtenerDetallesPedido(pedidoId);

    // Generar HTML del detalle
    const contenidoHTML = `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-base-content/60">ID de Pedido</p>
            <p class="font-semibold">#${pedido.id}</p>
          </div>
          <div>
            <p class="text-sm text-base-content/60">Fecha</p>
            <p class="font-semibold">${formatoFecha(pedido.fecha)}</p>
          </div>
        </div>

        <div>
          <p class="text-sm text-base-content/60">Cliente</p>
          <p class="font-semibold text-lg">${pedido.cliente}</p>
        </div>

        <div class="divider"></div>

        <div>
          <h4 class="font-semibold mb-2">Productos:</h4>
          <table class="table table-zebra table-sm">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>P. Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${detalles.map(detalle => `
                <tr>
                  <td>${detalle.producto_nombre}</td>
                  <td>${detalle.cantidad}</td>
                  <td>${formatoPrecio(detalle.precio_unitario)}</td>
                  <td class="font-semibold">${formatoPrecio(detalle.subtotal)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="divider"></div>

        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Subtotal (sin IVA):</span>
            <span>${formatoPrecio(pedido.subtotal)}</span>
          </div>
          <div class="flex justify-between">
            <span>IVA (19%):</span>
            <span>${formatoPrecio(pedido.iva)}</span>
          </div>
          <div class="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span class="text-success">${formatoPrecio(pedido.total)}</span>
          </div>
        </div>
      </div>
    `;

    // Mostrar modal
    document.getElementById('contenidoDetallePedido').innerHTML = contenidoHTML;
    document.getElementById('modalDetallePedido').showModal();

  } catch (error) {
    console.error('Error al ver detalle del pedido:', error);
    mostrarNotificacion('Error al cargar detalle del pedido', 'error');
  }
}

/**
 * Genera un arqueo de caja para el rango de fechas seleccionado
 */
async function generarArqueo() {
  const fechaInicioStr = document.getElementById('fechaInicio').value;
  const fechaFinStr = document.getElementById('fechaFin').value;

  if (!fechaInicioStr || !fechaFinStr) {
    mostrarNotificacion('Por favor seleccione las fechas de inicio y fin', 'warning');
    return;
  }

  const fechaInicio = new Date(fechaInicioStr);
  fechaInicio.setHours(0, 0, 0, 0);

  const fechaFin = new Date(fechaFinStr);
  fechaFin.setHours(23, 59, 59, 999);

  if (fechaInicio > fechaFin) {
    mostrarNotificacion('La fecha de inicio debe ser anterior a la fecha de fin', 'warning');
    return;
  }

  try {
    const pedidos = await db.obtenerPedidosPorRango(fechaInicio, fechaFin);

    if (pedidos.length === 0) {
      mostrarNotificacion('No hay pedidos en el rango seleccionado', 'info');
      document.getElementById('resultadosArqueo').classList.add('hidden');
      return;
    }

    // Calcular totales
    const totalPedidos = pedidos.length;
    const totalRecaudado = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);

    // Guardar pedidos para mostrar detalle
    pedidosArqueoActual = pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Mostrar resultados
    document.getElementById('arqueoPedidos').textContent = totalPedidos;
    document.getElementById('arqueoTotal').textContent = formatoPrecio(totalRecaudado);
    document.getElementById('resultadosArqueo').classList.remove('hidden');

    // Ocultar detalle inicialmente
    document.getElementById('detalleArqueo').classList.add('hidden');
    document.getElementById('btnToggleDetalleArqueo').textContent = 'Ver Detalle de Pedidos';

    mostrarNotificacion('Arqueo generado exitosamente', 'success');

  } catch (error) {
    console.error('Error al generar arqueo:', error);
    mostrarNotificacion('Error al generar arqueo', 'error');
  }
}

/**
 * Muestra/oculta el detalle del arqueo
 */
function toggleDetalleArqueo() {
  const detalleDiv = document.getElementById('detalleArqueo');
  const btn = document.getElementById('btnToggleDetalleArqueo');

  if (detalleDiv.classList.contains('hidden')) {
    // Mostrar detalle
    renderizarDetalleArqueo();
    detalleDiv.classList.remove('hidden');
    btn.textContent = 'Ocultar Detalle de Pedidos';
  } else {
    // Ocultar detalle
    detalleDiv.classList.add('hidden');
    btn.textContent = 'Ver Detalle de Pedidos';
  }
}

/**
 * Renderiza el detalle completo de los pedidos del arqueo
 */
function renderizarDetalleArqueo() {
  const detalleDiv = document.getElementById('detalleArqueo');

  const html = `
    <div class="overflow-x-auto">
      <table class="table table-zebra table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Subtotal s/IVA</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${pedidosArqueoActual.map(pedido => `
            <tr>
              <td class="font-semibold">#${pedido.id}</td>
              <td>${pedido.cliente}</td>
              <td>${formatoFecha(pedido.fecha)}</td>
              <td>${formatoPrecio(pedido.subtotal)}</td>
              <td>${formatoPrecio(pedido.iva)}</td>
              <td class="font-semibold text-success">${formatoPrecio(pedido.total)}</td>
              <td>
                <button
                  class="btn btn-info btn-xs"
                  onclick="verDetallePedido(${pedido.id})"
                >
                  Ver
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="font-bold">
            <td colspan="5" class="text-right">TOTAL:</td>
            <td class="text-success text-lg">
              ${formatoPrecio(pedidosArqueoActual.reduce((sum, p) => sum + p.total, 0))}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  detalleDiv.innerHTML = html;
}
