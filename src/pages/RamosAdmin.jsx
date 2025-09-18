import React from 'react';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de administración de asignaturas
 * Permite gestionar asignaturas y secciones
 * @returns {JSX.Element} Página RamosAdmin
 */
const RamosAdmin = () => {
  return (
    <div>
      <PageTitle 
        title="Administración de Asignaturas"
        description="Gestiona asignaturas y secciones"
      />
      
      <div className="bg-content1 p-6 rounded-medium shadow-xs">
        <p className="text-foreground-500">
          Esta página permitirá administrar las asignaturas y secciones.
          Implementación pendiente.
        </p>
      </div>
    </div>
  );
};

export default RamosAdmin;
