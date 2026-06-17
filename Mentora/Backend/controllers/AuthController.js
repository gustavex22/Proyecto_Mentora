const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuarios');
const { JWT_SECRET, JWT_EXPIRATION } = require('../constants');

// Controlador de login
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      });
    }

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador'
      });
    }

    // Verificar contraseña
    const passwordValido = await usuario.compararPassword(password);
    
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT con duración configurable (por defecto 8 horas)
    const token = jwt.sign(
      { 
        id: usuario._id, 
        correo: usuario.correo, 
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Retornar respuesta sin la contraseña
    const { password: _, ...usuarioData } = usuario.toObject();

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        usuario: usuarioData,
        token,
        expiresIn: JWT_EXPIRATION
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Controlador para verificar token y obtener datos del usuario actual
exports.getMe = async (req, res) => {
  try {
    // El middleware authMiddleware ya validó el token y agregó req.user
    const usuario = await Usuario.findById(req.user.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Controlador para refresh del token (opcional)
exports.refreshToken = async (req, res) => {
  try {
    // El middleware authMiddleware ya validó el token y agregó req.user
    const usuario = await Usuario.findById(req.user.id);
    
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      });
    }

    // Generar nuevo token JWT con duración configurable
    const token = jwt.sign(
      { 
        id: usuario._id, 
        correo: usuario.correo, 
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    return res.status(200).json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        token,
        expiresIn: JWT_EXPIRATION
      }
    });
  } catch (error) {
    console.error('Error al renovar token:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
