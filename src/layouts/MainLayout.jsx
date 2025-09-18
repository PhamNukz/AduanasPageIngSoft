import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

/**
 * Layout principal de la aplicación
 * Incluye header, sidebar y footer
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Layout principal
 */
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  /**
   * Función para alternar el estado de la sidebar
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        {/* Contenido principal */}
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
