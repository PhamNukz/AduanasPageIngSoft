import React from 'react';
import { Card, CardHeader, CardBody, Select, SelectItem } from '@heroui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Gráfico de uso de productos
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos para el gráfico
 * @returns {JSX.Element} Componente ProductUsageChart
 */
const ProductUsageChart = ({ data = [] }) => {
  const [period, setPeriod] = React.useState('month');
  
  // Filtrar datos según el período seleccionado
  const filteredData = React.useMemo(() => {
    if (period === 'week') {
      return data.slice(0, 7); // Últimos 7 días
    } else if (period === 'month') {
      return data; // Todo el mes
    }
    return data;
  }, [data, period]);

  /**
   * Manejador para cambio de período
   * @param {string} value - Nuevo valor seleccionado
   */
  const handlePeriodChange = (value) => {
    setPeriod(value.target.value);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Productos Más Utilizados</h3>
        <Select
          size="sm"
          className="w-32"
          selectedKeys={[period]}
          onChange={handlePeriodChange}
        >
          <SelectItem key="week" value="week">Semana</SelectItem>
          <SelectItem key="month" value="month">Mes</SelectItem>
        </Select>
      </CardHeader>
      <CardBody>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} kg`, 'Cantidad']}
                labelFormatter={(label) => `Producto: ${label}`}
              />
              <Bar 
                dataKey="quantity" 
                fill="hsl(var(--heroui-primary))" 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductUsageChart;
