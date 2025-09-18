import React from 'react';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de gestión de proveedores
 * Permite administrar los proveedores y sus productos
 * @returns {JSX.Element} Página GestionProveedores
 */
const GestionProveedores = () => {
  return (
    <div>
      <PageTitle 
        title="Gestión de Proveedores"
        description="Administra los proveedores y sus productos"
      />
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs">
        <p className="text-foreground-500">
          Esta página permitirá gestionar los proveedores.
          Implementación pendiente.
        </p>
      </div>
    </div>
  );
};

export default GestionProveedores;
