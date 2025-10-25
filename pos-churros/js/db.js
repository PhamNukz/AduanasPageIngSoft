/**
 * Sistema de Base de Datos Local con IndexedDB
 * Maneja todas las operaciones de almacenamiento local para el POS
 */

const DB_NAME = 'ChurrosPOS';
const DB_VERSION = 1;

class Database {
  constructor() {
    this.db = null;
  }

  /**
   * Inicializa la base de datos y crea las tablas necesarias
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject('Error al abrir la base de datos');
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Tabla de Usuarios
        if (!db.objectStoreNames.contains('usuarios')) {
          const usuariosStore = db.createObjectStore('usuarios', {
            keyPath: 'id',
            autoIncrement: true
          });
          usuariosStore.createIndex('username', 'username', { unique: true });

          // Insertar usuarios predefinidos
          usuariosStore.transaction.oncomplete = () => {
            const store = db.transaction('usuarios', 'readwrite').objectStore('usuarios');
            store.add({ username: 'admin', password: '1234' });
            store.add({ username: 'caja', password: '1234' });
          };
        }

        // Tabla de Productos
        if (!db.objectStoreNames.contains('productos')) {
          const productosStore = db.createObjectStore('productos', {
            keyPath: 'id',
            autoIncrement: true
          });
          productosStore.createIndex('nombre', 'nombre', { unique: false });

          // Insertar productos de ejemplo
          productosStore.transaction.oncomplete = () => {
            const store = db.transaction('productos', 'readwrite').objectStore('productos');
            store.add({
              nombre: 'Churros Rellenos x3',
              precio: 150,
              fecha_creacion: new Date().toISOString()
            });
            store.add({
              nombre: 'Churros Rellenos x6',
              precio: 280,
              fecha_creacion: new Date().toISOString()
            });
            store.add({
              nombre: 'Churros Simples x5',
              precio: 100,
              fecha_creacion: new Date().toISOString()
            });
            store.add({
              nombre: 'Chocolate Caliente',
              precio: 80,
              fecha_creacion: new Date().toISOString()
            });
          };
        }

        // Tabla de Pedidos
        if (!db.objectStoreNames.contains('pedidos')) {
          const pedidosStore = db.createObjectStore('pedidos', {
            keyPath: 'id',
            autoIncrement: true
          });
          pedidosStore.createIndex('fecha', 'fecha', { unique: false });
          pedidosStore.createIndex('cliente', 'cliente', { unique: false });
        }

        // Tabla de Detalles de Pedido
        if (!db.objectStoreNames.contains('detalles_pedido')) {
          const detallesStore = db.createObjectStore('detalles_pedido', {
            keyPath: 'id',
            autoIncrement: true
          });
          detallesStore.createIndex('pedido_id', 'pedido_id', { unique: false });
        }
      };
    });
  }

  /**
   * Verifica las credenciales de usuario
   */
  async verificarUsuario(username, password) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['usuarios'], 'readonly');
      const store = transaction.objectStore('usuarios');
      const index = store.index('username');
      const request = index.get(username);

      request.onsuccess = () => {
        const usuario = request.result;
        if (usuario && usuario.password === password) {
          resolve(usuario);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject('Error al verificar usuario');
    });
  }

  /**
   * Obtiene todos los productos
   */
  async obtenerProductos() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['productos'], 'readonly');
      const store = transaction.objectStore('productos');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error al obtener productos');
    });
  }

  /**
   * Agrega un nuevo producto
   */
  async agregarProducto(producto) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['productos'], 'readwrite');
      const store = transaction.objectStore('productos');
      const request = store.add({
        ...producto,
        fecha_creacion: new Date().toISOString()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error al agregar producto');
    });
  }

  /**
   * Elimina un producto
   */
  async eliminarProducto(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['productos'], 'readwrite');
      const store = transaction.objectStore('productos');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error al eliminar producto');
    });
  }

  /**
   * Sobreescribe todos los productos (para carga CSV)
   */
  async sobreescribirProductos(productos) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['productos'], 'readwrite');
      const store = transaction.objectStore('productos');

      // Primero limpiar todos los productos
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        // Luego agregar los nuevos productos
        let contador = 0;
        productos.forEach(producto => {
          store.add({
            ...producto,
            fecha_creacion: new Date().toISOString()
          });
          contador++;
        });

        transaction.oncomplete = () => resolve(contador);
      };

      clearRequest.onerror = () => reject('Error al sobreescribir productos');
    });
  }

  /**
   * Crea un nuevo pedido
   */
  async crearPedido(pedido) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pedidos', 'detalles_pedido'], 'readwrite');
      const pedidosStore = transaction.objectStore('pedidos');
      const detallesStore = transaction.objectStore('detalles_pedido');

      // Agregar el pedido
      const pedidoRequest = pedidosStore.add({
        cliente: pedido.cliente,
        fecha: new Date().toISOString(),
        subtotal: pedido.subtotal,
        iva: pedido.iva,
        total: pedido.total
      });

      pedidoRequest.onsuccess = () => {
        const pedidoId = pedidoRequest.result;

        // Agregar los detalles del pedido
        pedido.items.forEach(item => {
          detallesStore.add({
            pedido_id: pedidoId,
            producto_id: item.producto_id,
            producto_nombre: item.producto_nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            subtotal: item.subtotal
          });
        });

        transaction.oncomplete = () => resolve(pedidoId);
      };

      transaction.onerror = () => reject('Error al crear pedido');
    });
  }

  /**
   * Obtiene todos los pedidos
   */
  async obtenerPedidos() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pedidos'], 'readonly');
      const store = transaction.objectStore('pedidos');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error al obtener pedidos');
    });
  }

  /**
   * Obtiene los detalles de un pedido específico
   */
  async obtenerDetallesPedido(pedidoId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['detalles_pedido'], 'readonly');
      const store = transaction.objectStore('detalles_pedido');
      const index = store.index('pedido_id');
      const request = index.getAll(pedidoId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error al obtener detalles del pedido');
    });
  }

  /**
   * Obtiene pedidos en un rango de fechas
   */
  async obtenerPedidosPorRango(fechaInicio, fechaFin) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pedidos'], 'readonly');
      const store = transaction.objectStore('pedidos');
      const request = store.getAll();

      request.onsuccess = () => {
        const todos = request.result;
        const filtrados = todos.filter(pedido => {
          const fecha = new Date(pedido.fecha);
          return fecha >= fechaInicio && fecha <= fechaFin;
        });
        resolve(filtrados);
      };

      request.onerror = () => reject('Error al obtener pedidos por rango');
    });
  }
}

// Instancia global de la base de datos
const db = new Database();
