import React from 'react';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de gestión de recetas
 * Permite administrar las recetas y sus ingredientes
 * @returns {JSX.Element} Página GestionRecetas
 */
const GestionRecetas = () => {
  return (
    <div>
      <PageTitle 
        title="Gestión de Recetas"
        description="Administra las recetas y sus ingredientes"
      />
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs">
        <p className="text-foreground-500">
          Esta página permitirá gestionar las recetas.
          Implementación pendiente.
        </p>
      </div>
    </div>
  );
};

export default GestionRecetas;
