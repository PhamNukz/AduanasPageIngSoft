import React from 'react';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de conglomerado de pedidos
 * Muestra el total de productos solicitados por todas las asignaturas
 * @returns {JSX.Element} Página ConglomeradoPedidos
 */
const ConglomeradoPedidos = () => {
  return (
    <div>
      <PageTitle 
        title="Conglomerado de Pedidos"
        description="Total de productos solicitados por todas las asignaturas"
      />
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs">
        <p className="text-foreground-500">
          Esta página mostrará el conglomerado de todos los pedidos.
          Implementación pendiente.
        </p>
      </div>
    </div>
  );
};

export default ConglomeradoPedidos;
