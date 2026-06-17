const express = require("express");
const ResenasController = require("../controllers/ResenasController");

const api = express.Router();

api.post("/Resenas", ResenasController.createResena);
api.get("/Resenas", ResenasController.getResenas);
api.get("/Resenas/:id", ResenasController.getResenaById);
api.put("/Resenas/:id", ResenasController.updateResena);
api.delete("/Resenas/:id", ResenasController.deleteResena);

module.exports = api;
