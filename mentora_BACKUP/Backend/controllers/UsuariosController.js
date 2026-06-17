const mongoose = require("mongoose");
const Usuario = require("../models/Usuarios");

exports.createDocument = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        success: false,
        message: "Nombre, correo y contraseña son requeridos"
      });
    }

    // Validar que el rol sea válido si se proporciona
    if (rol && !["instructor", "estudiante"].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: "El rol debe ser 'instructor' o 'estudiante'"
      });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya está registrado"
      });
    }

    // Crear y guardar el usuario (la encriptación se hace automáticamente en el modelo)
    const document = new Usuario(req.body);
    const savedDocument = await document.save();

    // Retornar el usuario sin la contraseña
    const { password: _, ...usuarioData } = savedDocument.toObject();

    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      document: usuarioData
    });
  } catch (error) {
    // Manejar error de duplicado de correo (aunque ya lo verificamos antes)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya está registrado"
      });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Usuario.find().select("-password");
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

    const document = await Usuario.findById(id).select("-password");
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

    // Si se intenta actualizar el correo, verificar que no exista
    if (req.body.correo) {
      const usuarioConCorreo = await Usuario.findOne({
        correo: req.body.correo.toLowerCase(),
        _id: { $ne: id }
      });
      if (usuarioConCorreo) {
        return res.status(400).json({
          success: false,
          message: "El correo electrónico ya está registrado"
        });
      }
    }

    const updatedDocument = await Usuario.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

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

    const deletedDocument = await Usuario.findByIdAndDelete(id);
    if (!deletedDocument) {
      return res.status(404).json({ success: false, message: "Documento no encontrado" });
    }

    return res.status(200).json({ success: true, message: "Documento eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};