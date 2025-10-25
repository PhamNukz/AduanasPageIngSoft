/**
 * Controlador Principal de la Aplicación
 * Maneja navegación, sesión, tema y funcionalidades generales
 */

// Variables globales
let usuarioActual = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', async () => {
  // Verificar si hay sesión activa
  verificarSesion();

  // Inicializar base de datos
  try {
    await db.init();
    console.log('Base de datos inicializada');

    // Inicializar módulos
    await inicializarPedidos();
    await inicializarProductos();
    await inicializarHistorial();
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    alert('Error al inicializar la aplicación. Por favor, recargue la página.');
  }

  // Configurar navegación
  configurarNavegacion();

  // Configurar tema
  configurarTema();

  // Configurar cerrar sesión
  document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
});

/**
 * Verifica que haya una sesión activa
 */
function verificarSesion() {
  const usuarioJSON = sessionStorage.getItem('usuarioActual');

  if (!usuarioJSON) {
    // No hay sesión, redirigir a login
    window.location.href = 'index.html';
    return;
  }

  usuarioActual = JSON.parse(usuarioJSON);

  // Mostrar nombre de usuario
  document.getElementById('usuarioActual').textContent = `Usuario: ${usuarioActual.username}`;
}

/**
 * Cierra la sesión actual
 */
function cerrarSesion() {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    sessionStorage.removeItem('usuarioActual');
    window.location.href = 'index.html';
  }
}

/**
 * Configura la navegación entre páginas
 */
function configurarNavegacion() {
  const menuItems = document.querySelectorAll('.menu-item');
  const pages = document.querySelectorAll('.page');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      const pageId = item.dataset.page;

      // Actualizar menú activo
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');

      // Mostrar página correspondiente
      pages.forEach(page => {
        if (page.id === `page-${pageId}`) {
          page.classList.add('active');

          // Refrescar datos al cambiar de página
          if (pageId === 'productos') {
            cargarProductosTabla();
          } else if (pageId === 'historial') {
            cargarHistorial();
          } else if (pageId === 'nuevo-pedido') {
            cargarProductosSelect();
          }
        } else {
          page.classList.remove('active');
        }
      });
    });
  });
}

/**
 * Configura el cambio de tema claro/oscuro
 */
function configurarTema() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Cargar tema guardado
  const temaGuardado = localStorage.getItem('tema') || 'light';
  html.setAttribute('data-theme', temaGuardado);
  themeToggle.checked = temaGuardado === 'dark';

  // Cambiar tema
  themeToggle.addEventListener('change', (e) => {
    const nuevoTema = e.target.checked ? 'dark' : 'light';
    html.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('tema', nuevoTema);
  });
}

/**
 * Formatea un número como precio en CLP
 */
function formatoPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
}

/**
 * Formatea una fecha en formato legible
 */
function formatoFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(fecha);
}

/**
 * Genera un toast de notificación
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
  const tipos = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  const toast = document.createElement('div');
  toast.className = `alert ${tipos[tipo]} fixed top-4 right-4 w-96 shadow-lg z-50`;
  toast.innerHTML = `
    <span>${mensaje}</span>
  `;

  document.body.appendChild(toast);

  // Animar entrada
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 100);

  // Eliminar después de 3 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
