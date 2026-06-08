const express = require("express");
const InscripcionesController = require("../controllers/InscripcionesController");

const api = express.Router();

api.post("/Inscripciones", InscripcionesController.createInscripcion);
api.get("/Inscripciones", InscripcionesController.getInscripciones);
api.get("/Inscripciones/:id", InscripcionesController.getInscripcionById);
api.put("/Inscripciones/:id", InscripcionesController.updateInscripcion);
api.delete("/Inscripciones/:id", InscripcionesController.deleteInscripcion);

module.exports = api;
