import React from 'react';
import { Card, CardHeader, CardBody, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useHistory } from 'react-router-dom';

/**
 * Tarjeta que muestra asignaturas con solicitudes pendientes
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.pendingCourses - Lista de asignaturas pendientes
 * @returns {JSX.Element} Componente PendingRequestsCard
 */
const PendingRequestsCard = ({ pendingCourses = [] }) => {
  const history = useHistory();
  
  /**
   * Función para navegar a la página de solicitudes
   */
  const goToRequests = () => {
    history.push('/solicitud');
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Asignaturas sin Solicitudes</h3>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={goToRequests}
          endContent={<Icon icon="lucide:arrow-right" width={16} height={16} />}
        >
          Ver todas
        </Button>
      </CardHeader>
      <CardBody>
        {pendingCourses.length > 0 ? (
          <ul className="space-y-2">
            {pendingCourses.map((course) => (
              <li 
                key={course.id} 
                className="flex items-center gap-2 p-2 rounded-md bg-content2"
              >
                <Icon icon="lucide:alert-circle" className="text-warning" width={18} height={18} />
                <div>
                  <p className="font-medium">{course.name}</p>
                  <p className="text-xs text-foreground-500">
                    Profesor: {course.teacher}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Icon icon="lucide:check-circle" className="text-success mb-2" width={40} height={40} />
            <p className="text-foreground-500">Todas las asignaturas tienen solicitudes realizadas</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PendingRequestsCard;
