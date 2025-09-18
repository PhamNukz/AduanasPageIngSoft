import React from 'react';
import { motion } from 'framer-motion';
import PageTitle from '../components/common/PageTitle';
import StatCard from '../components/dashboard/StatCard';
import PendingRequestsCard from '../components/dashboard/PendingRequestsCard';
import ProductUsageChart from '../components/dashboard/ProductUsageChart';
import RequestsCompletionChart from '../components/dashboard/RequestsCompletionChart';
import { useAuth } from '../contexts/AuthContext';

/**
 * Página de dashboard
 * Muestra estadísticas, gráficos y alertas
 * @returns {JSX.Element} Página Dashboard
 */
const Dashboard = () => {
  const { user } = useAuth();
  
  // Datos de ejemplo para estadísticas
  const stats = [
    {
      title: 'Solicitudes Completadas',
      value: '85%',
      icon: 'lucide:check-circle',
      color: 'success',
      trend: 'up',
      trendValue: '5%'
    },
    {
      title: 'Productos en Stock',
      value: '1,245',
      icon: 'lucide:package',
      color: 'primary',
      trend: 'up',
      trendValue: '12%'
    },
    {
      title: 'Productos Bajo Stock',
      value: '28',
      icon: 'lucide:alert-triangle',
      color: 'warning',
      trend: 'down',
      trendValue: '3%'
    },
    {
      title: 'Pedidos Pendientes',
      value: '15',
      icon: 'lucide:clock',
      color: 'secondary',
      trend: 'neutral',
      trendValue: '0%'
    }
  ];
  
  // Datos de ejemplo para asignaturas sin solicitudes
  const pendingCourses = [
    { id: 1, name: 'Cocina Internacional', teacher: 'María González' },
    { id: 2, name: 'Pastelería Avanzada', teacher: 'Juan Pérez' },
    { id: 3, name: 'Técnicas de Corte', teacher: 'Ana Rodríguez' }
  ];
  
  // Datos de ejemplo para el gráfico de uso de productos
  const productUsageData = [
    { name: 'Harina', quantity: 120 },
    { name: 'Azúcar', quantity: 85 },
    { name: 'Sal', quantity: 45 },
    { name: 'Aceite', quantity: 70 },
    { name: 'Huevos', quantity: 95 },
    { name: 'Leche', quantity: 110 },
    { name: 'Mantequilla', quantity: 60 },
    { name: 'Carne', quantity: 75 },
    { name: 'Arroz', quantity: 90 },
    { name: 'Pasta', quantity: 65 }
  ];
  
  // Datos de ejemplo para el gráfico de completitud de solicitudes
  const requestsCompletionData = [
    { name: 'Completadas', value: 85 },
    { name: 'En Proceso', value: 10 },
    { name: 'Rechazadas', value: 5 }
  ];

  return (
    <div>
      <PageTitle 
        title={`Bienvenido, ${user?.name}`}
        description="Resumen del sistema KuHub"
      />
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
      
      {/* Gráficos y alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de uso de productos */}
        <div className="lg:col-span-2">
          <ProductUsageChart data={productUsageData} />
        </div>
        
        {/* Asignaturas sin solicitudes */}
        <div>
          <PendingRequestsCard pendingCourses={pendingCourses} />
        </div>
        
        {/* Gráfico de completitud de solicitudes */}
        <div className="lg:col-span-2">
          <RequestsCompletionChart data={requestsCompletionData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
