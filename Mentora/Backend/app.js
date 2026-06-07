const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");

const app = express()
//const AuthRouter = require("./router/auth")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("uploads"));


app.use(cors({ origin: "http://localhost:3000" }));

//app.use(`/api/${API_VERSION}`, AuthRouter)

module.exports = app