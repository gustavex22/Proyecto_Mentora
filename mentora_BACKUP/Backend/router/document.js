const express = require("express");
const DocumentController = require("../controllers/documentController");

const api = express.Router();

api.post("/documents", DocumentController.createDocument);
api.get("/documents", DocumentController.getDocuments);
api.get("/documents/:id", DocumentController.getDocumentById);
api.put("/documents/:id", DocumentController.updateDocument);
api.delete("/documents/:id", DocumentController.deleteDocument);

module.exports = api;
