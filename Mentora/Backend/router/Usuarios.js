const express = require("express");
const UsuariosController = require("../controllers/UsuariosController");

const api = express.Router();

api.post("/Usuarios", UsuariosController.createDocument);
api.get("/Usuarios", UsuariosController.getDocuments);
api.get("/Usuarios/:id", UsuariosController.getDocumentById);
api.put("/Usuarios/:id", UsuariosController.updateDocument);
api.delete("/Usuarios/:id", UsuariosController.deleteDocument);

module.exports = api;
