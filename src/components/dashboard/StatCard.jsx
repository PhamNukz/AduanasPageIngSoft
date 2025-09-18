import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

/**
 * Tarjeta de estadísticas para el dashboard
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la estadística
 * @param {string|number} props.value - Valor de la estadística
 * @param {string} props.icon - Icono a mostrar
 * @param {string} props.color - Color del icono (primary, secondary, success, warning, danger)
 * @param {string} props.trend - Tendencia (up, down, neutral)
 * @param {string} props.trendValue - Valor de la tendencia
 * @returns {JSX.Element} Componente StatCard
 */
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend = 'neutral',
  trendValue = '0%'
}) => {
  // Mapeo de colores para iconos y tendencias
  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger'
  };
  
  // Iconos y colores para tendencias
  const trendIcons = {
    up: 'lucide:trending-up',
    down: 'lucide:trending-down',
    neutral: 'lucide:minus'
  };
  
  const trendColors = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-default-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-visible">
        <CardBody>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-foreground-500 text-sm">{title}</p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              
              <div className="flex items-center mt-2">
                <Icon 
                  icon={trendIcons[trend]} 
                  className={trendColors[trend]} 
                  width={16} 
                  height={16} 
                />
                <span className={`text-xs ml-1 ${trendColors[trend]}`}>
                  {trendValue}
                </span>
              </div>
            </div>
            
            <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900`}>
              <Icon 
                icon={icon} 
                className={colorMap[color]} 
                width={24} 
                height={24} 
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default StatCard;
