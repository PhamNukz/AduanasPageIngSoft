import React from 'react';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de bodega de tránsito
 * Gestiona los productos en la bodega del piso 2
 * @returns {JSX.Element} Página BodegaTransito
 */
const BodegaTransito = () => {
  return (
    <div>
      <PageTitle 
        title="Bodega de Tránsito"
        description="Gestiona los productos en la bodega del piso 2"
      />
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs">
        <p className="text-foreground-500">
          Esta página permitirá gestionar la bodega de tránsito.
          Implementación pendiente.
        </p>
      </div>
    </div>
  );
};

export default BodegaTransito;
