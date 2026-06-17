const express = require("express");
const LeccionesController = require("../controllers/LeccionesController");

const api = express.Router();

api.post("/Lecciones", LeccionesController.createLeccion);
api.get("/Lecciones", LeccionesController.getLecciones);
api.get("/Lecciones/:id", LeccionesController.getLeccionById);
api.put("/Lecciones/:id", LeccionesController.updateLeccion);
api.delete("/Lecciones/:id", LeccionesController.deleteLeccion);

module.exports = api;
