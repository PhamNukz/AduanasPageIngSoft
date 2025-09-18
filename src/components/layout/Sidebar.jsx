import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';

/**
 * Componente de barra lateral
 * Muestra el logo y los enlaces de navegación según los permisos del usuario
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de apertura de la sidebar
 * @returns {JSX.Element} Componente Sidebar
 */
const Sidebar = ({ isOpen }) => {
  const { hasRole } = useAuth();
  const location = useLocation();
  
  // Definición de los enlaces de navegación con sus permisos
  const navLinks = [
    {
      to: '/dashboard',
      icon: 'lucide:layout-dashboard',
      label: 'Dashboard',
      roles: [] // Todos los roles tienen acceso
    },
    {
      to: '/solicitud',
      icon: 'lucide:clipboard-list',
      label: 'Solicitud',
      roles: ['Profesor A Cargo', 'Admin', 'Co-Admin']
    },
    {
      to: '/ramos-admin',
      icon: 'lucide:book-open',
      label: 'Asignaturas',
      roles: ['Admin', 'Co-Admin']
    },
    {
      to: '/inventario',
      icon: 'lucide:package',
      label: 'Inventario',
      roles: ['Admin', 'Co-Admin', 'Encargado de Bodega']
    },
    {
      to: '/gestion-pedidos',
      icon: 'lucide:shopping-cart',
      label: 'Gestión Pedidos',
      roles: ['Admin', 'Co-Admin', 'Gestor de Pedidos']
    },
    {
      to: '/conglomerado-pedidos',
      icon: 'lucide:layers',
      label: 'Conglomerado',
      roles: ['Admin', 'Co-Admin', 'Gestor de Pedidos']
    },
    {
      to: '/gestion-proveedores',
      icon: 'lucide:truck',
      label: 'Proveedores',
      roles: ['Admin', 'Co-Admin', 'Gestor de Pedidos']
    },
    {
      to: '/bodega-transito',
      icon: 'lucide:warehouse',
      label: 'Bodega Tránsito',
      roles: ['Admin', 'Co-Admin', 'Asistente de Bodega']
    },
    {
      to: '/gestion-recetas',
      icon: 'lucide:utensils',
      label: 'Recetas',
      roles: ['Admin', 'Co-Admin', 'Profesor A Cargo']
    },
    {
      to: '/gestion-roles',
      icon: 'lucide:users',
      label: 'Gestión Roles',
      roles: ['Admin']
    }
  ];

  // Animación para la sidebar
  const sidebarVariants = {
    open: { width: '240px', transition: { duration: 0.3 } },
    closed: { width: '72px', transition: { duration: 0.3 } }
  };

  return (
    <motion.aside
      className="bg-content1 border-r border-divider h-screen overflow-y-auto flex flex-col z-20"
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      initial={isOpen ? 'open' : 'closed'}
    >
      {/* Logo */}
      <div className="p-4 flex justify-center items-center">
        <Logo size={isOpen ? 'md' : 'sm'} />
      </div>
      
      {/* Navegación */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navLinks.map((link) => {
            // Verificar si el usuario tiene permiso para ver este enlace
            if (link.roles.length > 0 && !hasRole(link.roles)) {
              return null;
            }
            
            const isActive = location.pathname === link.to;
            
            return (
              <li key={link.to}>
                <NavLink 
                  to={link.to} 
                  className="block"
                  activeClassName="bg-primary-100 dark:bg-primary-900"
                >
                  <Button
                    variant="flat"
                    color={isActive ? "primary" : "default"}
                    className={`w-full justify-start ${isOpen ? 'px-3' : 'justify-center'}`}
                    startContent={
                      <Icon 
                        icon={link.icon} 
                        width={20} 
                        height={20} 
                      />
                    }
                  >
                    {isOpen && <span>{link.label}</span>}
                  </Button>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
