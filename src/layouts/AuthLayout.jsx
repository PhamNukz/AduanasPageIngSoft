import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTheme } from '@heroui/use-theme';
import { Button } from '@heroui/react';
import Logo from '../components/common/Logo';

/**
 * Layout para páginas de autenticación
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Layout de autenticación
 */
const AuthLayout = ({ children }) => {
  const { theme, setTheme } = useTheme();
  
  /**
   * Función para alternar el tema
   */
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header con logo y botón de tema */}
      <header className="p-4 flex justify-between items-center">
        <Logo size="md" />
        <Button
          isIconOnly
          variant="light"
          aria-label="Cambiar tema"
          onPress={toggleTheme}
        >
          <Icon 
            icon={theme === 'light' ? 'lucide:moon' : 'lucide:sun'} 
            width={24} 
            height={24} 
          />
        </Button>
      </header>
      
      {/* Contenido principal */}
      <motion.main 
        className="flex-1 flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <footer className="p-4 text-center text-foreground-500 text-sm">
        © 2025 KuHub System | Version 0.1
      </footer>
    </div>
  );
};

export default AuthLayout;
