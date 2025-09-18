import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * Gráfico circular de completitud de solicitudes
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos para el gráfico
 * @returns {JSX.Element} Componente RequestsCompletionChart
 */
const RequestsCompletionChart = ({ data = [] }) => {
  // Colores para el gráfico
  const COLORS = [
    'hsl(var(--heroui-success))',
    'hsl(var(--heroui-warning))',
    'hsl(var(--heroui-danger))'
  ];

  /**
   * Formateador personalizado para las etiquetas
   * @param {string} value - Valor de la etiqueta
   * @param {Object} entry - Entrada de datos
   * @returns {string} Etiqueta formateada
   */
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Estado de Solicitudes</h3>
      </CardHeader>
      <CardBody>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} solicitudes`, 'Cantidad']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default RequestsCompletionChart;
