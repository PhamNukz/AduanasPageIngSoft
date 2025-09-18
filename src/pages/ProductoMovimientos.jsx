import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Chip,
  Pagination,
  Card,
  CardBody
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useParams, useHistory } from 'react-router-dom';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de movimientos de un producto
 * Muestra el historial de entradas, salidas y mermas
 * @returns {JSX.Element} Página ProductoMovimientos
 */
const ProductoMovimientos = () => {
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = React.useState(null);
  const [movements, setMovements] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  
  // Cargar datos de ejemplo
  React.useEffect(() => {
    // Simular carga de datos desde API
    const sampleProduct = {
      id: parseInt(id),
      name: 'Harina',
      category: 'abarrotes',
      quantity: 50,
      unit: 'kg',
      minStock: 20,
      description: 'Harina de trigo'
    };
    
    const sampleMovements = [
      { id: 1, productId: parseInt(id), type: 'entrada', quantity: 20, unit: 'kg', reason: 'Compra inicial', date: '2025-05-15T10:30:00', user: 'Barbara' },
      { id: 2, productId: parseInt(id), type: 'salida', quantity: 5, unit: 'kg', reason: 'Solicitud para clase de panadería', date: '2025-05-16T09:15:00', user: 'Profesor Juan' },
      { id: 3, productId: parseInt(id), type: 'entrada', quantity: 15, unit: 'kg', reason: 'Reposición de stock', date: '2025-05-17T14:20:00', user: 'Barbara' },
      { id: 4, productId: parseInt(id), type: 'merma', quantity: 2, unit: 'kg', reason: 'Producto dañado', date: '2025-05-18T11:45:00', user: 'Encargado Bodega' },
      { id: 5, productId: parseInt(id), type: 'salida', quantity: 8, unit: 'kg', reason: 'Solicitud para clase de repostería', date: '2025-05-19T08:30:00', user: 'Profesor Ana' },
      { id: 6, productId: parseInt(id), type: 'entrada', quantity: 30, unit: 'kg', reason: 'Compra mensual', date: '2025-05-20T13:10:00', user: 'Barbara' },
      { id: 7, productId: parseInt(id), type: 'salida', quantity: 10, unit: 'kg', reason: 'Solicitud para clase de panadería avanzada', date: '2025-05-21T10:00:00', user: 'Profesor Carlos' },
      { id: 8, productId: parseInt(id), type: 'merma', quantity: 1, unit: 'kg', reason: 'Producto vencido', date: '2025-05-22T15:30:00', user: 'Encargado Bodega' },
      { id: 9, productId: parseInt(id), type: 'entrada', quantity: 5, unit: 'kg', reason: 'Devolución de clase', date: '2025-05-23T09:45:00', user: 'Profesor Juan' },
      { id: 10, productId: parseInt(id), type: 'salida', quantity: 12, unit: 'kg', reason: 'Solicitud para clase de pastelería', date: '2025-05-24T11:20:00', user: 'Profesor María' },
      { id: 11, productId: parseInt(id), type: 'entrada', quantity: 10, unit: 'kg', reason: 'Compra de emergencia', date: '2025-05-25T14:00:00', user: 'Barbara' },
      { id: 12, productId: parseInt(id), type: 'salida', quantity: 7, unit: 'kg', reason: 'Solicitud para clase de panadería', date: '2025-05-26T09:30:00', user: 'Profesor Juan' }
    ];
    
    setProduct(sampleProduct);
    setMovements(sampleMovements);
  }, [id]);
  
  // Calcular movimientos paginados
  const paginatedMovements = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    
    return movements.slice(start, end);
  }, [movements, page, rowsPerPage]);
  
  /**
   * Formatear fecha para mostrar
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  /**
   * Renderizar chip según el tipo de movimiento
   * @param {string} type - Tipo de movimiento
   * @returns {JSX.Element} Componente Chip
   */
  const renderMovementType = (type) => {
    switch (type) {
      case 'entrada':
        return <Chip color="success" size="sm">Entrada</Chip>;
      case 'salida':
        return <Chip color="primary" size="sm">Salida</Chip>;
      case 'merma':
        return <Chip color="danger" size="sm">Merma</Chip>;
      default:
        return <Chip size="sm">{type}</Chip>;
    }
  };
  
  /**
   * Volver a la página de inventario
   */
  const handleBack = () => {
    history.push('/inventario');
  };

  // Si no hay producto, mostrar carga
  if (!product) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="flat"
          size="sm"
          onPress={handleBack}
          startContent={<Icon icon="lucide:arrow-left" width={16} height={16} />}
        >
          Volver
        </Button>
        <PageTitle 
          title={`Movimientos de ${product.name}`}
          description={`Historial de entradas, salidas y mermas`}
        />
      </div>
      
      {/* Información del producto */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-foreground-500 text-sm">Producto</p>
              <p className="font-semibold">{product.name}</p>
            </div>
            <div>
              <p className="text-foreground-500 text-sm">Stock Actual</p>
              <p className="font-semibold">{product.quantity} {product.unit}</p>
            </div>
            <div>
              <p className="text-foreground-500 text-sm">Stock Mínimo</p>
              <p className="font-semibold">{product.minStock} {product.unit}</p>
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Tabla de movimientos */}
      <div className="bg-content1 rounded-medium shadow-xs overflow-hidden">
        <Table 
          aria-label="Tabla de movimientos"
          removeWrapper
          bottomContent={
            <div className="flex justify-center">
              <Pagination
                total={Math.ceil(movements.length / rowsPerPage)}
                page={page}
                onChange={setPage}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>TIPO</TableColumn>
            <TableColumn>FECHA</TableColumn>
            <TableColumn>CANTIDAD</TableColumn>
            <TableColumn>MOTIVO</TableColumn>
            <TableColumn>USUARIO</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay movimientos registrados">
            {paginatedMovements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{renderMovementType(movement.type)}</TableCell>
                <TableCell>{formatDate(movement.date)}</TableCell>
                <TableCell>{movement.quantity} {movement.unit}</TableCell>
                <TableCell>{movement.reason}</TableCell>
                <TableCell>{movement.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductoMovimientos;
