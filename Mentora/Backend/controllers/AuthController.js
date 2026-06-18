const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuarios');
const { JWT_SECRET, JWT_EXPIRATION } = require('../constants');

// Controlador de registro de nuevos usuarios
exports.register = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, correo y contraseña son requeridos'
      });
    }

    if (rol && !['instructor', 'estudiante'].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: "El rol debe ser 'instructor' o 'estudiante'"
      });
    }

    const usuarioExistente = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }

    const usuario = new Usuario({
      nombre,
      correo: correo.toLowerCase(),
      password,
      rol: rol || 'estudiante'
    });

    const savedUsuario = await usuario.save();

    const token = jwt.sign(
      { 
        id: savedUsuario._id, 
        correo: savedUsuario.correo, 
        rol: savedUsuario.rol,
        nombre: savedUsuario.nombre
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    const { password: _, ...usuarioData } = savedUsuario.toObject();

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        usuario: usuarioData,
        token,
        expiresIn: JWT_EXPIRATION
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }
    console.error('Error en registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      });
    }

    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador'
      });
    }

    const passwordValido = await usuario.compararPassword(password);
    
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

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

exports.getMe = async (req, res) => {
  try {
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

exports.refreshToken = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id);
    
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      });
    }

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
