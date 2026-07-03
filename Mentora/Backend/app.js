const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION, CORS_ORIGIN } = require("./constants");

const AuthRouter = require("./router/Auth");
const UsuariosRouter = require("./router/Usuarios");
const CursosRouter = require("./router/Cursos");
const InscripcionesRouter = require("./router/Inscripciones");
const LeccionesRouter = require("./router/Lecciones");
const ResenasRouter = require("./router/Resenas");
const SeccionesRouter = require("./router/Secciones");
const DashboardRouter = require("./router/Dashboard");
const app = express()

app.use(bodyParser.urlencoded({ extended: true, limit: "3mb" }));
app.use(bodyParser.json({ limit: "3mb" }));

app.use(express.static("uploads"));

app.use(cors({ origin: CORS_ORIGIN }));

app.use(`/api/${API_VERSION}`, AuthRouter);
app.use(`/api/${API_VERSION}`, UsuariosRouter);
app.use(`/api/${API_VERSION}`, InscripcionesRouter);
app.use(`/api/${API_VERSION}`, ResenasRouter);
app.use(`/api/${API_VERSION}`, CursosRouter);
app.use(`/api/${API_VERSION}`, LeccionesRouter);
app.use(`/api/${API_VERSION}`, SeccionesRouter);
app.use(`/api/${API_VERSION}`, DashboardRouter);

module.exports = app