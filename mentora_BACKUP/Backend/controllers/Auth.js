const Usuario = require("../models/Usuarios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generar JWT token
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "tu_secreto_super_seguro", {
    expiresIn: "7d"
  });
}

// REGISTRO
async function register(req, res) {
  try {
    const { nombre, correo, password, passwordConfirm } = req.body;

    // Validaciones
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });
    if (!correo) return res.status(400).json({ error: "El email es obligatorio" });
    if (!password) return res.status(400).json({ error: "La contraseña es obligatoria" });
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener mínimo 6 caracteres" });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo: correo.toLowerCase(),
      password: hashedPassword,
      rol: "estudiante",
      activo: true
    });

    // Generar token
    const token = generateToken(nuevoUsuario._id);

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { correo, password } = req.body;

    // Validaciones
    if (!correo) return res.status(400).json({ error: "El email es obligatorio" });
    if (!password) return res.status(400).json({ error: "La contraseña es obligatoria" });

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({ error: "Usuario inactivo" });
    }

    // Generar token
    const token = generateToken(usuario._id);

    res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

module.exports = { register, login };