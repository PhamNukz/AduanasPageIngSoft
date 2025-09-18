import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Página 404 - No encontrado
 * @returns {JSX.Element} Página NotFound
 */
const NotFound = () => {
  const history = useHistory();
  
  /**
   * Volver a la página principal
   */
  const handleGoHome = () => {
    history.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md"
      >
        <Icon 
          icon="lucide:file-question" 
          className="text-primary mx-auto mb-6" 
          width={80} 
          height={80} 
        />
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
        
        <p className="text-foreground-500 mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>
        
        <Button 
          color="primary" 
          size="lg"
          onPress={handleGoHome}
          startContent={<Icon icon="lucide:home" width={18} height={18} />}
        >
          Volver al Inicio
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
