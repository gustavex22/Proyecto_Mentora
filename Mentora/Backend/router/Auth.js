const express = require("express");
const { register, login } = require("../controllers/AuthController");

const api = express.Router();

api.post("/auth/register", register);
api.post("/auth/login", login);

module.exports = api;