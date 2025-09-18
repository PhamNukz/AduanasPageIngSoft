import React from 'react';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de solicitud de insumos
 * Permite a los profesores solicitar insumos para sus clases
 * @returns {JSX.Element} Página Solicitud
 */
const Solicitud = () => {
  return (
    <div>
      <PageTitle 
        title="Solicitud de Insumos"
        description="Realiza solicitudes de insumos para tus clases"
      />
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs">
        <p className="text-foreground-500">
          Esta página permitirá a los profesores realizar solicitudes de insumos para sus clases.
          Implementación pendiente.
        </p>
      </div>
    </div>
  );
};

export default Solicitud;
