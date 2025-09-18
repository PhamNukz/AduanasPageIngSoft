import React from 'react';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de gestión de pedidos
 * Permite gestionar los pedidos a proveedores
 * @returns {JSX.Element} Página GestionPedidos
 */
const GestionPedidos = () => {
  return (
    <div>
      <PageTitle 
        title="Gestión de Pedidos"
        description="Administra los pedidos a proveedores"
      />
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs">
        <p className="text-foreground-500">
          Esta página permitirá gestionar los pedidos a proveedores.
          Implementación pendiente.
        </p>
      </div>
    </div>
  );
};

export default GestionPedidos;
