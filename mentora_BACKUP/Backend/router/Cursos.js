const express = require("express");
const CursosController = require("../controllers/CursosController");

const api = express.Router();

api.post("/Cursos", CursosController.createCurso);
api.get("/Cursos", CursosController.getCursos);
api.get("/Cursos/:id", CursosController.getCursoById);
api.put("/Cursos/:id", CursosController.updateCurso);
api.delete("/Cursos/:id", CursosController.deleteCurso);

module.exports = api;
