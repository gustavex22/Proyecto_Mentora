const express = require("express");
const CursosController = require("../controllers/CursosController");
const authMiddleware = require("../middlewares/authMiddleware");
const { esInstructor } = require("../middlewares/roleMiddleware");

const api = express.Router();

api.post("/Cursos", authMiddleware, esInstructor, CursosController.createCurso);
api.get("/Cursos", CursosController.getCursos);
api.get("/Cursos/:id", CursosController.getCursoById);
api.put("/Cursos/:id", authMiddleware, esInstructor, CursosController.updateCurso);
api.patch("/Cursos/:id/publicar", authMiddleware, esInstructor, CursosController.togglePublicado);
api.delete("/Cursos/:id", authMiddleware, esInstructor, CursosController.deleteCurso);

module.exports = api;