import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Input, 
  Chip, 
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useHistory } from 'react-router-dom';
import PageTitle from '../components/common/PageTitle';
import ProductForm from '../components/inventory/ProductForm';
import ProductMovementModal from '../components/inventory/ProductMovementModal';

/**
 * Página de inventario
 * Muestra la lista de productos y permite gestionarlos
 * @returns {JSX.Element} Página Inventario
 */
const Inventario = () => {
  // Estado para productos
  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  
  // Estado para paginación
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  
  // Modales
  const { 
    isOpen: isProductFormOpen, 
    onOpen: onProductFormOpen, 
    onClose: onProductFormClose 
  } = useDisclosure();
  
  const { 
    isOpen: isMovementModalOpen, 
    onOpen: onMovementModalOpen, 
    onClose: onMovementModalClose 
  } = useDisclosure();
  
  const history = useHistory();
  
  // Categorías de productos
  const categories = [
    { value: 'lacteos', label: 'Lácteos' },
    { value: 'carnes', label: 'Carnes' },
    { value: 'frutas', label: 'Frutas y Verduras' },
    { value: 'abarrotes', label: 'Abarrotes' },
    { value: 'condimentos', label: 'Condimentos' },
    { value: 'otros', label: 'Otros' }
  ];
  
  // Unidades de medida
  const units = [
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'g', label: 'Gramos (g)' },
    { value: 'l', label: 'Litros (l)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'unidad', label: 'Unidad' },
    { value: 'paquete', label: 'Paquete' }
  ];
  
  // Cargar datos de ejemplo
  React.useEffect(() => {
    // Simular carga de datos desde API
    const sampleProducts = [
      { id: 1, name: 'Harina', category: 'abarrotes', quantity: 50, unit: 'kg', minStock: 20, description: 'Harina de trigo' },
      { id: 2, name: 'Azúcar', category: 'abarrotes', quantity: 30, unit: 'kg', minStock: 15, description: 'Azúcar refinada' },
      { id: 3, name: 'Leche', category: 'lacteos', quantity: 40, unit: 'l', minStock: 20, description: 'Leche entera' },
      { id: 4, name: 'Huevos', category: 'lacteos', quantity: 200, unit: 'unidad', minStock: 50, description: 'Huevos blancos' },
      { id: 5, name: 'Carne molida', category: 'carnes', quantity: 15, unit: 'kg', minStock: 10, description: 'Carne molida de res' },
      { id: 6, name: 'Pollo', category: 'carnes', quantity: 25, unit: 'kg', minStock: 15, description: 'Pollo entero' },
      { id: 7, name: 'Tomates', category: 'frutas', quantity: 30, unit: 'kg', minStock: 10, description: 'Tomates frescos' },
      { id: 8, name: 'Cebollas', category: 'frutas', quantity: 40, unit: 'kg', minStock: 15, description: 'Cebollas blancas' },
      { id: 9, name: 'Sal', category: 'condimentos', quantity: 10, unit: 'kg', minStock: 5, description: 'Sal fina' },
      { id: 10, name: 'Pimienta', category: 'condimentos', quantity: 5, unit: 'kg', minStock: 2, description: 'Pimienta negra' },
      { id: 11, name: 'Aceite', category: 'abarrotes', quantity: 30, unit: 'l', minStock: 15, description: 'Aceite vegetal' },
      { id: 12, name: 'Arroz', category: 'abarrotes', quantity: 60, unit: 'kg', minStock: 25, description: 'Arroz grano largo' }
    ];
    
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);
  
  // Filtrar productos cuando cambia el término de búsqueda
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryLabel(product.category).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProducts(filtered);
    setPage(1); // Resetear a la primera página al filtrar
  }, [searchTerm, products]);
  
  // Calcular productos paginados
  const paginatedProducts = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page, rowsPerPage]);
  
  /**
   * Obtener etiqueta de categoría a partir de su valor
   * @param {string} categoryValue - Valor de la categoría
   * @returns {string} Etiqueta de la categoría
   */
  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  /**
   * Manejador para abrir el formulario de producto
   * @param {Object} product - Producto a editar (null para crear nuevo)
   */
  const handleOpenProductForm = (product = null) => {
    setSelectedProduct(product);
    onProductFormOpen();
  };
  
  /**
   * Manejador para abrir el modal de movimientos
   * @param {Object} product - Producto seleccionado
   */
  const handleOpenMovementModal = (product) => {
    setSelectedProduct(product);
    onMovementModalOpen();
  };
  
  /**
   * Manejador para guardar un producto (crear o actualizar)
   * @param {Object} productData - Datos del producto
   */
  const handleSaveProduct = (productData) => {
    if (selectedProduct) {
      // Actualizar producto existente
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id ? { ...p, ...productData } : p
      );
      setProducts(updatedProducts);
    } else {
      // Crear nuevo producto
      const newProduct = {
        ...productData,
        id: products.length + 1 // En un entorno real, el ID vendría del backend
      };
      setProducts([...products, newProduct]);
    }
    
    onProductFormClose();
  };
  
  /**
   * Manejador para registrar un movimiento de producto
   * @param {Object} movementData - Datos del movimiento
   */
  const handleSaveMovement = (movementData) => {
    // En un entorno real, se enviaría al backend
    
    // Actualizar cantidad del producto según el tipo de movimiento
    const updatedProducts = products.map(p => {
      if (p.id === movementData.productId) {
        let newQuantity = p.quantity;
        
        if (movementData.type === 'entrada') {
          newQuantity += movementData.quantity;
        } else if (movementData.type === 'salida' || movementData.type === 'merma') {
          newQuantity -= movementData.quantity;
        }
        
        return { ...p, quantity: newQuantity };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    onMovementModalClose();
  };
  
  /**
   * Manejador para ver los movimientos de un producto
   * @param {number} productId - ID del producto
   */
  const handleViewMovements = (productId) => {
    history.push(`/producto/${productId}/movimientos`);
  };
  
  /**
   * Manejador para eliminar un producto
   * @param {number} productId - ID del producto a eliminar
   */
  const handleDeleteProduct = (productId) => {
    // En un entorno real, se enviaría al backend
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
  };
  
  /**
   * Renderizar el estado de stock de un producto
   * @param {Object} product - Producto
   * @returns {JSX.Element} Componente Chip con el estado
   */
  const renderStockStatus = (product) => {
    if (product.quantity <= 0) {
      return <Chip color="danger" size="sm">Sin stock</Chip>;
    } else if (product.quantity < product.minStock) {
      return <Chip color="warning" size="sm">Bajo stock</Chip>;
    } else {
      return <Chip color="success" size="sm">En stock</Chip>;
    }
  };

  return (
    <div>
      <PageTitle 
        title="Inventario"
        description="Gestión de productos y existencias"
      />
      
      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Icon icon="lucide:search" className="text-default-400" width={18} height={18} />}
          className="w-full sm:w-72"
        />
        
        <Button
          color="primary"
          onPress={() => handleOpenProductForm()}
          startContent={<Icon icon="lucide:plus" width={18} height={18} />}
        >
          Nuevo Producto
        </Button>
      </div>
      
      {/* Tabla de productos */}
      <div className="bg-content1 rounded-medium shadow-xs overflow-hidden">
        <Table 
          aria-label="Tabla de productos"
          removeWrapper
          bottomContent={
            <div className="flex justify-center">
              <Pagination
                total={Math.ceil(filteredProducts.length / rowsPerPage)}
                page={page}
                onChange={setPage}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>CATEGORÍA</TableColumn>
            <TableColumn>CANTIDAD</TableColumn>
            <TableColumn>STOCK MÍNIMO</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay productos disponibles">
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{getCategoryLabel(product.category)}</TableCell>
                <TableCell>{product.quantity} {product.unit}</TableCell>
                <TableCell>{product.minStock} {product.unit}</TableCell>
                <TableCell>{renderStockStatus(product)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light"
                          aria-label="Más acciones"
                        >
                          <Icon icon="lucide:more-vertical" width={16} height={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Acciones de producto">
                        <DropdownItem 
                          key="edit" 
                          startContent={<Icon icon="lucide:edit" width={16} height={16} />}
                          onPress={() => handleOpenProductForm(product)}
                        >
                          Editar
                        </DropdownItem>
                        <DropdownItem 
                          key="movement" 
                          startContent={<Icon icon="lucide:move" width={16} height={16} />}
                          onPress={() => handleOpenMovementModal(product)}
                        >
                          Registrar Movimiento
                        </DropdownItem>
                        <DropdownItem 
                          key="history" 
                          startContent={<Icon icon="lucide:history" width={16} height={16} />}
                          onPress={() => handleViewMovements(product.id)}
                        >
                          Ver Movimientos
                        </DropdownItem>
                        <DropdownItem 
                          key="delete" 
                          className="text-danger" 
                          color="danger"
                          startContent={<Icon icon="lucide:trash" width={16} height={16} />}
                          onPress={() => handleDeleteProduct(product.id)}
                        >
                          Eliminar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Modal de formulario de producto */}
      <ProductForm 
        isOpen={isProductFormOpen}
        onClose={onProductFormClose}
        onSubmit={handleSaveProduct}
        product={selectedProduct}
        categories={categories}
        units={units}
      />
      
      {/* Modal de movimiento de producto */}
      <ProductMovementModal 
        isOpen={isMovementModalOpen}
        onClose={onMovementModalClose}
        onSubmit={handleSaveMovement}
        product={selectedProduct}
      />
    </div>
  );
};

export default Inventario;
