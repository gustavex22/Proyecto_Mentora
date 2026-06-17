const express = require("express");
const UsuariosController = require("../controllers/UsuariosController");
const authMiddleware = require("../middlewares/authMiddleware");
const { esInstructor, esEstudiante } = require("../middlewares/roleMiddleware");

const api = express.Router();

api.post("/Usuarios", authMiddleware, esInstructor, UsuariosController.createDocument); 
api.get("/Usuarios", authMiddleware, UsuariosController.getDocuments);
api.get("/Usuarios/:id", authMiddleware, UsuariosController.getDocumentById);
api.put("/Usuarios/:id", authMiddleware, UsuariosController.updateDocument); 
api.delete("/Usuarios/:id", authMiddleware, esInstructor, UsuariosController.deleteDocument);

module.exports = api;
