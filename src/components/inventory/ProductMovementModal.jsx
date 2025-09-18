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
 * Modal para registrar movimientos de productos (entrada, salida, merma)
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSubmit - Función para enviar el formulario
 * @param {Object} props.product - Producto seleccionado
 * @returns {JSX.Element} Componente ProductMovementModal
 */
const ProductMovementModal = ({ isOpen, onClose, onSubmit, product }) => {
  // Estado del formulario
  const [formData, setFormData] = React.useState({
    type: 'entrada',
    quantity: '',
    reason: ''
  });
  
  // Errores de validación
  const [errors, setErrors] = React.useState({});
  
  // Resetear formulario al abrir
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'entrada',
        quantity: '',
        reason: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  /**
   * Manejador para cambios en los campos del formulario
   * @param {Object} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar que la cantidad no sea negativa
    if (name === 'quantity' && parseFloat(value) < 0) {
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
    
    if (!formData.type) {
      newErrors.type = 'El tipo de movimiento es obligatorio';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'La cantidad es obligatoria';
    } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'La cantidad debe ser un número positivo';
    } else if (formData.type === 'salida' && parseFloat(formData.quantity) > product.quantity) {
      newErrors.quantity = `No puede sacar más de ${product.quantity} ${product.unit}`;
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'El motivo es obligatorio';
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
        productId: product.id,
        productName: product.name,
        date: new Date().toISOString()
      });
    }
  };

  // Si no hay producto seleccionado, no mostrar nada
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Registrar Movimiento - {product.name}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <p className="text-sm text-foreground-500">
                  Stock actual: <span className="font-semibold">{product.quantity} {product.unit}</span>
                </p>
                
                <Select
                  label="Tipo de Movimiento"
                  name="type"
                  selectedKeys={[formData.type]}
                  onChange={(e) => handleChange({ target: { name: 'type', value: e.target.value } })}
                  isInvalid={!!errors.type}
                  errorMessage={errors.type}
                  isRequired
                >
                  <SelectItem key="entrada" value="entrada">Entrada</SelectItem>
                  <SelectItem key="salida" value="salida">Salida</SelectItem>
                  <SelectItem key="merma" value="merma">Merma</SelectItem>
                </Select>
                
                <Input
                  label="Cantidad"
                  name="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.quantity}
                  onChange={handleChange}
                  isInvalid={!!errors.quantity}
                  errorMessage={errors.quantity}
                  isRequired
                  endContent={<div className="pointer-events-none">{product.unit}</div>}
                />
                
                <Textarea
                  label="Motivo"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Indique el motivo del movimiento"
                  isInvalid={!!errors.reason}
                  errorMessage={errors.reason}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Registrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProductMovementModal;
