import React from 'react';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de gestión de roles
 * Permite administrar los roles y permisos de usuarios
 * @returns {JSX.Element} Página GestionRoles
 */
const GestionRoles = () => {
  return (
    <div>
      <PageTitle 
        title="Gestión de Roles"
        description="Administra los roles y permisos de usuarios"
      />
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs">
        <p className="text-foreground-500">
          Esta página permitirá gestionar los roles y permisos.
          Implementación pendiente.
        </p>
      </div>
    </div>
  );
};

export default GestionRoles;
