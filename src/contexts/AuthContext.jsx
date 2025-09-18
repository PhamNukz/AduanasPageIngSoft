import React from 'react';
import { useHistory } from 'react-router-dom';

// Contexto de autenticación
const AuthContext = React.createContext();

/**
 * Proveedor de autenticación
 * Gestiona el estado de autenticación y los datos del usuario
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Proveedor de contexto de autenticación
 */
export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();

  // Usuarios de prueba
  const testUsers = [
    { id: 1, username: 'admin', password: 'admin', name: 'Administrador', role: 'Admin', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1' },
    { id: 2, username: 'coadmin', password: 'coadmin', name: 'Barbara', role: 'Co-Admin', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=2' },
    { id: 3, username: 'profesor', password: 'profesor', name: 'Profesor', role: 'Profesor A Cargo', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=3' },
    { id: 4, username: 'bodega', password: 'bodega', name: 'Encargado Bodega', role: 'Encargado de Bodega', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=4' },
    { id: 5, username: 'asistente', password: 'asistente', name: 'Asistente Bodega', role: 'Asistente de Bodega', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=5' },
    { id: 6, username: 'gestor', password: 'gestor', name: 'Gestor Pedidos', role: 'Gestor de Pedidos', avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=6' },
  ];

  /**
   * Inicializa la autenticación al cargar la aplicación
   * Verifica si hay un usuario guardado en localStorage
   */
  React.useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('kuhub_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  /**
   * Función para iniciar sesión
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {boolean} - Resultado de la autenticación
   */
  const login = (username, password) => {
    // Buscar usuario en la lista de prueba
    const user = testUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      // Guardar usuario en localStorage y estado
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('kuhub_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    localStorage.removeItem('kuhub_user');
    setUser(null);
    setIsAuthenticated(false);
    history.push('/login');
  };

  /**
   * Función para actualizar datos del usuario
   * @param {Object} userData - Nuevos datos del usuario
   */
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('kuhub_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  /**
   * Función para verificar si el usuario tiene un rol específico
   * @param {string|Array} roles - Rol o roles a verificar
   * @returns {boolean} - Resultado de la verificación
   */
  const hasRole = (roles) => {
    if (!user) return false;
    
    // Si es Admin o Co-Admin, tiene acceso a todo
    if (user.role === 'Admin' || user.role === 'Co-Admin') return true;
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  // Valor del contexto
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 * @returns {Object} Contexto de autenticación
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
