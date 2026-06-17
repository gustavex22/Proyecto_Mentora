const express = require("express");
const { verificarToken } = require("../middlewares/autenticacion");

const api = express.Router();

// Ejemplo de ruta protegida
// api.get("/usuarios/perfil", verificarToken, UsuariosController.getPerfil);
// api.put("/usuarios/actualizar", verificarToken, UsuariosController.actualizar);

module.exports = api;
