import React from 'react';
import { Icon } from '@iconify/react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, useDisclosure } from '@heroui/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '@heroui/use-theme';
import ThemeSwitcher from '../common/ThemeSwitcher';

/**
 * Componente de cabecera
 * Incluye botón para sidebar, título de página y menú de usuario
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.toggleSidebar - Función para alternar la sidebar
 * @param {boolean} props.sidebarOpen - Estado de la sidebar
 * @returns {JSX.Element} Componente Header
 */
const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const { theme } = useTheme();
  
  // Obtener el título de la página actual
  const getPageTitle = () => {
    const path = window.location.pathname;
    
    const titles = {
      '/dashboard': 'Dashboard',
      '/solicitud': 'Solicitud de Insumos',
      '/ramos-admin': 'Administración de Asignaturas',
      '/inventario': 'Inventario',
      '/gestion-pedidos': 'Gestión de Pedidos',
      '/conglomerado-pedidos': 'Conglomerado de Pedidos',
      '/gestion-proveedores': 'Gestión de Proveedores',
      '/bodega-transito': 'Bodega de Tránsito',
      '/gestion-roles': 'Gestión de Roles',
      '/gestion-recetas': 'Gestión de Recetas',
      '/perfil': 'Mi Perfil',
    };
    
    // Verificar si es una página de movimientos de producto
    if (path.includes('/producto/') && path.includes('/movimientos')) {
      return 'Movimientos de Producto';
    }
    
    return titles[path] || 'KuHub';
  };

  /**
   * Manejador para ir al perfil de usuario
   */
  const handleProfileClick = () => {
    history.push('/perfil');
  };

  return (
    <header className="bg-content1 border-b border-divider py-2 px-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center">
        <Button
          isIconOnly
          variant="light"
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          onPress={toggleSidebar}
          className="mr-4"
        >
          <Icon 
            icon={sidebarOpen ? 'lucide:menu-fold' : 'lucide:menu-unfold'} 
            width={24} 
            height={24} 
          />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Selector de tema */}
        <ThemeSwitcher />
        
        {/* Menú de usuario */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button 
              variant="light" 
              className="flex items-center gap-2 px-2"
            >
              <Avatar
                src={user?.avatar}
                name={user?.name}
                size="sm"
                isBordered
                color="primary"
              />
              <span className="hidden md:block font-medium">{user?.name}</span>
              <Icon icon="lucide:chevron-down" width={16} height={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Opciones de usuario">
            <DropdownItem key="profile" onPress={handleProfileClick}>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:user" width={18} height={18} />
                Mi Perfil
              </div>
            </DropdownItem>
            <DropdownItem key="role" isReadOnly className="opacity-70">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shield" width={18} height={18} />
                Rol: {user?.role}
              </div>
            </DropdownItem>
            <DropdownItem key="logout" className="text-danger" color="danger" onPress={logout}>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:log-out" width={18} height={18} />
                Cerrar Sesión
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
