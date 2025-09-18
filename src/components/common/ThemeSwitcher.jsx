import React from 'react';
import { Icon } from '@iconify/react';
import { Switch, Tooltip } from '@heroui/react';
import { useTheme } from '@heroui/use-theme';

/**
 * Componente para cambiar entre tema claro y oscuro
 * @returns {JSX.Element} Componente ThemeSwitcher
 */
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  
  /**
   * Función para alternar el tema
   */
  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  return (
    <Tooltip 
      content={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      placement="bottom"
    >
      <div className="flex items-center gap-2">
        <Icon 
          icon="lucide:sun" 
          className={`text-default-500 ${!isDark && 'text-warning-500'}`} 
          width={18} 
          height={18} 
        />
        <Switch 
          isSelected={isDark}
          onValueChange={handleToggle}
          size="sm"
          color="primary"
          className="mx-1"
        />
        <Icon 
          icon="lucide:moon" 
          className={`text-default-500 ${isDark && 'text-primary-500'}`} 
          width={18} 
          height={18} 
        />
      </div>
    </Tooltip>
  );
};

export default ThemeSwitcher;
