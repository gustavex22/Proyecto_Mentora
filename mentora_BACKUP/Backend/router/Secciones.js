const express = require("express");
const SeccionesController = require("../controllers/SeccionesController");

const api = express.Router();

api.post("/Secciones", SeccionesController.createSeccion);
api.get("/Secciones", SeccionesController.getSecciones);
api.get("/Secciones/:id", SeccionesController.getSeccionById);
api.put("/Secciones/:id", SeccionesController.updateSeccion);
api.delete("/Secciones/:id", SeccionesController.deleteSeccion);

module.exports = api;
