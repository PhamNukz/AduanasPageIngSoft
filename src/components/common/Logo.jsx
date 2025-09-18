import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de logo
 * Muestra el logo de KuHub con diferentes tamaños
 * @param {Object} props - Propiedades del componente
 * @param {string} props.size - Tamaño del logo (sm, md, lg)
 * @returns {JSX.Element} Componente Logo
 */
const Logo = ({ size = 'md' }) => {
  // Definir clases según el tamaño
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };
  
  return (
    <Link to="/" className="flex items-center">
      <span className={`font-bold ${sizeClasses[size]} text-primary`}>
        Ku<span className="text-secondary">Hub</span>
      </span>
    </Link>
  );
};

export default Logo;
