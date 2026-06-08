const mongoose = require("mongoose");
const Document = require("../models/Usuarios");

exports.createDocument = async (req, res) => {
  try {
    const document = new Document(req.body);
    const savedDocument = await document.save();
    return res.status(201).json({ success: true, document: savedDocument });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    return res.status(200).json({ success: true, documents });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Documento no encontrado" });
    }

    return res.status(200).json({ success: true, document });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const updatedDocument = await Document.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      return res.status(404).json({ success: false, message: "Documento no encontrado" });
    }

    return res.status(200).json({ success: true, document: updatedDocument });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const deletedDocument = await Document.findByIdAndDelete(id);
    if (!deletedDocument) {
      return res.status(404).json({ success: false, message: "Documento no encontrado" });
    }

    return res.status(200).json({ success: true, message: "Documento eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
