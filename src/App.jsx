import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useTheme } from '@heroui/use-theme';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Solicitud from './pages/Solicitud';
import RamosAdmin from './pages/RamosAdmin';
import Inventario from './pages/Inventario';
import GestionPedidos from './pages/GestionPedidos';
import ConglomeradoPedidos from './pages/ConglomeradoPedidos';
import GestionProveedores from './pages/GestionProveedores';
import BodegaTransito from './pages/BodegaTransito';
import GestionRoles from './pages/GestionRoles';
import GestionRecetas from './pages/GestionRecetas';
import UserProfile from './pages/UserProfile';
import ProductoMovimientos from './pages/ProductoMovimientos';
import NotFound from './pages/NotFound';

/**
 * Componente principal de la aplicación
 * Gestiona las rutas y la autenticación
 */
function App() {
  const { theme } = useTheme();
  const { user, isAuthenticated, loading } = useAuth();
  
  // Aplicar tema claro/oscuro al elemento html
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Mostrar carga mientras se verifica la autenticación
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  /**
   * Componente para rutas protegidas
   * Verifica si el usuario está autenticado y tiene los permisos necesarios
   */
  const ProtectedRoute = ({ component: Component, requiredRoles = [], ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        // Si no está autenticado, redirigir al login
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        
        // Si no se requieren roles específicos o el usuario tiene el rol requerido
        const hasRequiredRole = requiredRoles.length === 0 || 
                               requiredRoles.includes(user.role) ||
                               user.role === 'Admin' || 
                               user.role === 'Co-Admin';
        
        if (hasRequiredRole) {
          return (
            <MainLayout>
              <Component {...props} />
            </MainLayout>
          );
        }
        
        // Si no tiene los permisos necesarios, redirigir al dashboard
        return <Redirect to="/dashboard" />;
      }}
    />
  );

  return (
    <Switch>
      {/* Ruta pública - Login */}
      <Route path="/login" exact>
        <AuthLayout>
          <Login />
        </AuthLayout>
      </Route>
      
      {/* Rutas protegidas */}
      <ProtectedRoute path="/dashboard" exact component={Dashboard} />
      <ProtectedRoute 
        path="/solicitud" 
        component={Solicitud} 
        requiredRoles={['Profesor A Cargo', 'Admin', 'Co-Admin']} 
      />
      <ProtectedRoute 
        path="/ramos-admin" 
        component={RamosAdmin} 
        requiredRoles={['Admin', 'Co-Admin']} 
      />
      <ProtectedRoute 
        path="/inventario" 
        component={Inventario} 
        requiredRoles={['Admin', 'Co-Admin', 'Encargado de Bodega']} 
      />
      <ProtectedRoute 
        path="/gestion-pedidos" 
        component={GestionPedidos} 
        requiredRoles={['Admin', 'Co-Admin', 'Gestor de Pedidos']} 
      />
      <ProtectedRoute 
        path="/conglomerado-pedidos" 
        component={ConglomeradoPedidos} 
        requiredRoles={['Admin', 'Co-Admin', 'Gestor de Pedidos']} 
      />
      <ProtectedRoute 
        path="/gestion-proveedores" 
        component={GestionProveedores} 
        requiredRoles={['Admin', 'Co-Admin', 'Gestor de Pedidos']} 
      />
      <ProtectedRoute 
        path="/bodega-transito" 
        component={BodegaTransito} 
        requiredRoles={['Admin', 'Co-Admin', 'Asistente de Bodega']} 
      />
      <ProtectedRoute 
        path="/gestion-roles" 
        component={GestionRoles} 
        requiredRoles={['Admin']} 
      />
      <ProtectedRoute 
        path="/gestion-recetas" 
        component={GestionRecetas} 
        requiredRoles={['Admin', 'Co-Admin', 'Profesor A Cargo']} 
      />
      <ProtectedRoute 
        path="/perfil" 
        component={UserProfile} 
      />
      <ProtectedRoute 
        path="/producto/:id/movimientos" 
        component={ProductoMovimientos} 
        requiredRoles={['Admin', 'Co-Admin', 'Encargado de Bodega']} 
      />
      
      {/* Redirección por defecto */}
      <Route path="/" exact>
        <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />
      </Route>
      
      {/* Página 404 */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

export default App;
