const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");

const AuthRouter = require("./router/Auth");
const DocumentRouter = require("./router/document");
const UsuariosRouter = require("./router/Usuarios");
const CursosRouter = require("./router/Cursos");
const InscripcionesRouter = require("./router/Inscripciones");
const LeccionesRouter = require("./router/Lecciones");
const ResenasRouter = require("./router/Resenas");
const SeccionesRouter = require("./router/Secciones");
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("uploads"));

app.use(cors({ origin: "http://localhost:3000" }));

app.use(`/api/${API_VERSION}`, AuthRouter);
app.use(`/api/${API_VERSION}`, DocumentRouter)
app.use(`/api/${API_VERSION}`, UsuariosRouter)
app.use(`/api/${API_VERSION}`, CursosRouter)
app.use(`/api/${API_VERSION}`, InscripcionesRouter)
app.use(`/api/${API_VERSION}`, LeccionesRouter)
app.use(`/api/${API_VERSION}`, ResenasRouter)
app.use(`/api/${API_VERSION}`, SeccionesRouter)

module.exports = app