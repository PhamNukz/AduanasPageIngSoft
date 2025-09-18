import React from 'react';
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Avatar,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import PageTitle from '../components/common/PageTitle';

/**
 * Página de perfil de usuario
 * Permite cambiar contraseña y foto de perfil
 * @returns {JSX.Element} Página UserProfile
 */
const UserProfile = () => {
  const { user, updateUser } = useAuth();
  
  // Estados para formularios
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordErrors, setPasswordErrors] = React.useState({});
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Estado para la foto de perfil
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatar || '');
  const [avatarError, setAvatarError] = React.useState('');
  const [avatarSuccess, setAvatarSuccess] = React.useState(false);
  
  // Lista de avatares predefinidos
  const avatarOptions = [
    'https://img.heroui.chat/image/avatar?w=200&h=200&u=1',
    'https://img.heroui.chat/image/avatar?w=200&h=200&u=2',
    'https://img.heroui.chat/image/avatar?w=200&h=200&u=3',
    'https://img.heroui.chat/image/avatar?w=200&h=200&u=4',
    'https://img.heroui.chat/image/avatar?w=200&h=200&u=5',
    'https://img.heroui.chat/image/avatar?w=200&h=200&u=6',
    'https://img.heroui.chat/image/avatar?w=200&h=200&u=7',
    'https://img.heroui.chat/image/avatar?w=200&h=200&u=8',
  ];
  
  /**
   * Manejador para cambios en el formulario de contraseña
   * @param {Object} e - Evento de cambio
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
    
    // Limpiar mensajes
    setPasswordSuccess(false);
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null
      });
    }
  };
  
  /**
   * Validar formulario de cambio de contraseña
   * @returns {boolean} Resultado de la validación
   */
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'La contraseña actual es obligatoria';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'La nueva contraseña es obligatoria';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Manejador para enviar el formulario de cambio de contraseña
   */
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simular tiempo de carga
    setTimeout(() => {
      // En un entorno real, se enviaría al backend
      
      // Resetear formulario
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordSuccess(true);
      setIsLoading(false);
    }, 1000);
  };
  
  /**
   * Manejador para seleccionar un avatar
   * @param {string} url - URL del avatar seleccionado
   */
  const handleSelectAvatar = (url) => {
    setAvatarUrl(url);
    setAvatarError('');
    setAvatarSuccess(false);
  };
  
  /**
   * Manejador para guardar el avatar seleccionado
   */
  const handleSaveAvatar = () => {
    if (!avatarUrl) {
      setAvatarError('Debe seleccionar un avatar');
      return;
    }
    
    // En un entorno real, se enviaría al backend
    updateUser({ avatar: avatarUrl });
    setAvatarSuccess(true);
  };

  return (
    <div>
      <PageTitle 
        title="Mi Perfil"
        description="Gestiona tu información personal"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cambio de avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-4">Foto de Perfil</h2>
              
              <div className="flex flex-col items-center mb-6">
                <Avatar
                  src={avatarUrl}
                  name={user?.name}
                  className="w-24 h-24 mb-4"
                  isBordered
                  color="primary"
                />
                <p className="text-foreground-500 text-sm">
                  Selecciona un avatar para tu perfil
                </p>
              </div>
              
              <Divider className="my-4" />
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                {avatarOptions.map((url, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer rounded-full p-1 transition-all ${
                      avatarUrl === url ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary-200'
                    }`}
                    onClick={() => handleSelectAvatar(url)}
                  >
                    <Avatar
                      src={url}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
              
              {avatarError && (
                <p className="text-danger text-sm mb-4">{avatarError}</p>
              )}
              
              {avatarSuccess && (
                <div className="flex items-center gap-2 text-success text-sm mb-4">
                  <Icon icon="lucide:check-circle" width={16} height={16} />
                  <span>Avatar actualizado correctamente</span>
                </div>
              )}
              
              <Button 
                color="primary" 
                className="w-full"
                onPress={handleSaveAvatar}
              >
                Guardar Avatar
              </Button>
            </CardBody>
          </Card>
        </motion.div>
        
        {/* Cambio de contraseña */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Contraseña Actual"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!passwordErrors.currentPassword}
                  errorMessage={passwordErrors.currentPassword}
                />
                
                <Input
                  label="Nueva Contraseña"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!passwordErrors.newPassword}
                  errorMessage={passwordErrors.newPassword}
                />
                
                <Input
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!passwordErrors.confirmPassword}
                  errorMessage={passwordErrors.confirmPassword}
                />
                
                {passwordSuccess && (
                  <div className="flex items-center gap-2 text-success">
                    <Icon icon="lucide:check-circle" width={16} height={16} />
                    <span>Contraseña actualizada correctamente</span>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  color="primary" 
                  className="w-full"
                  isLoading={isLoading}
                >
                  Cambiar Contraseña
                </Button>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
