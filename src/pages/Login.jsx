import React from 'react';
import { Card, CardBody, Input, Button, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

/**
 * Página de inicio de sesión
 * @returns {JSX.Element} Página Login
 */
const Login = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();
  const history = useHistory();

  /**
   * Manejador para cambio en el campo de usuario
   * @param {Object} e - Evento de cambio
   */
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (error) setError('');
  };

  /**
   * Manejador para cambio en el campo de contraseña
   * @param {Object} e - Evento de cambio
   */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  /**
   * Manejador para enviar el formulario
   * @param {Object} e - Evento de formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }
    
    setIsLoading(true);
    
    // Simular tiempo de carga
    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        history.push('/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-md">
          <CardBody className="p-6 space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Icon icon="logos:duoc-uc" width={120} height={60} />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                KuHub System
              </h1>
              <p className="text-foreground-500 mt-2">
                Sistema de Gestión de Inventario y Pedidos
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Usuario"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={handleUsernameChange}
                startContent={
                  <Icon icon="lucide:user" className="text-default-400" width={18} height={18} />
                }
                isInvalid={!!error}
              />
              
              <Input
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                startContent={
                  <Icon icon="lucide:lock" className="text-default-400" width={18} height={18} />
                }
                isInvalid={!!error}
                errorMessage={error}
              />
              
              <Button 
                type="submit" 
                color="primary" 
                className="w-full"
                isLoading={isLoading}
              >
                Iniciar Sesión
              </Button>
            </form>
            
            <div className="text-center text-xs text-foreground-500">
              <p>Usuarios de prueba:</p>
              <p>admin/admin, profesor/profesor, bodega/bodega</p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
