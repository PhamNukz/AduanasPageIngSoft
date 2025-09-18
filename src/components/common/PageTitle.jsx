import React from 'react';

/**
 * Componente para título de página con descripción opcional
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título principal
 * @param {string} props.description - Descripción opcional
 * @returns {JSX.Element} Componente PageTitle
 */
const PageTitle = ({ title, description }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {description && (
        <p className="mt-2 text-foreground-500">{description}</p>
      )}
    </div>
  );
};

export default PageTitle;
