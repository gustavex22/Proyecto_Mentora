const mongoose = require("mongoose");
const Leccion = require("../models/Lecciones");

exports.createLeccion = async (req, res) => {
  try {
    const leccion = new Leccion(req.body);
    const savedLeccion = await leccion.save();
    return res.status(201).json({ success: true, leccion: savedLeccion });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getLecciones = async (req, res) => {
  try {
    const lecciones = await Leccion.find();
    return res.status(200).json({ success: true, lecciones });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeccionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const leccion = await Leccion.findById(id);
    if (!leccion) {
      return res.status(404).json({ success: false, message: "Lección no encontrada" });
    }

    return res.status(200).json({ success: true, leccion });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLeccion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const updatedLeccion = await Leccion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLeccion) {
      return res.status(404).json({ success: false, message: "Lección no encontrada" });
    }

    return res.status(200).json({ success: true, leccion: updatedLeccion });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteLeccion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const deletedLeccion = await Leccion.findByIdAndDelete(id);
    if (!deletedLeccion) {
      return res.status(404).json({ success: false, message: "Lección no encontrada" });
    }

    return res.status(200).json({ success: true, message: "Lección eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
