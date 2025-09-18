import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Select, 
  SelectItem,
  Textarea
} from '@heroui/react';

/**
 * Formulario para crear o editar productos
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSubmit - Función para enviar el formulario
 * @param {Object} props.product - Producto a editar (null para crear nuevo)
 * @param {Array} props.categories - Categorías disponibles
 * @param {Array} props.units - Unidades de medida disponibles
 * @returns {JSX.Element} Componente ProductForm
 */
const ProductForm = ({ isOpen, onClose, onSubmit, product = null, categories = [], units = [] }) => {
  // Estado del formulario
  const [formData, setFormData] = React.useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    minStock: '',
    description: ''
  });
  
  // Errores de validación
  const [errors, setErrors] = React.useState({});
  
  // Cargar datos del producto si está en modo edición
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        quantity: product.quantity || '',
        unit: product.unit || '',
        minStock: product.minStock || '',
        description: product.description || ''
      });
    } else {
      // Resetear formulario en modo creación
      setFormData({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        minStock: '',
        description: ''
      });
    }
    
    // Limpiar errores
    setErrors({});
  }, [product, isOpen]);

  /**
   * Manejador para cambios en los campos del formulario
   * @param {Object} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar que los campos numéricos no sean negativos
    if ((name === 'quantity' || name === 'minStock') && parseFloat(value) < 0) {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  /**
   * Validar formulario antes de enviar
   * @returns {boolean} Resultado de la validación
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'La cantidad es obligatoria';
    } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) < 0) {
      newErrors.quantity = 'La cantidad debe ser un número positivo';
    }
    
    if (!formData.unit) {
      newErrors.unit = 'La unidad es obligatoria';
    }
    
    if (!formData.minStock) {
      newErrors.minStock = 'El stock mínimo es obligatorio';
    } else if (isNaN(formData.minStock) || parseFloat(formData.minStock) < 0) {
      newErrors.minStock = 'El stock mínimo debe ser un número positivo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejador para enviar el formulario
   */
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        quantity: parseFloat(formData.quantity),
        minStock: parseFloat(formData.minStock)
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {product ? 'Editar Producto' : 'Nuevo Producto'}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                  isRequired
                />
                
                <Select
                  label="Categoría"
                  name="category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  onChange={(e) => handleChange({ target: { name: 'category', value: e.target.value } })}
                  isInvalid={!!errors.category}
                  errorMessage={errors.category}
                  isRequired
                >
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </Select>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Cantidad"
                    name="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={handleChange}
                    isInvalid={!!errors.quantity}
                    errorMessage={errors.quantity}
                    isRequired
                  />
                  
                  <Select
                    label="Unidad"
                    name="unit"
                    selectedKeys={formData.unit ? [formData.unit] : []}
                    onChange={(e) => handleChange({ target: { name: 'unit', value: e.target.value } })}
                    isInvalid={!!errors.unit}
                    errorMessage={errors.unit}
                    isRequired
                  >
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                
                <Input
                  label="Stock Mínimo"
                  name="minStock"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minStock}
                  onChange={handleChange}
                  isInvalid={!!errors.minStock}
                  errorMessage={errors.minStock}
                  isRequired
                />
                
                <Textarea
                  label="Descripción"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción del producto (opcional)"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                {product ? 'Actualizar' : 'Crear'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProductForm;
