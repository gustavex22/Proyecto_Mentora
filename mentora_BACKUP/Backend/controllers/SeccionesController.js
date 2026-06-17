const mongoose = require("mongoose");
const Seccion = require("../models/Secciones");

exports.createSeccion = async (req, res) => {
  try {
    const seccion = new Seccion(req.body);
    const savedSeccion = await seccion.save();
    return res.status(201).json({ success: true, seccion: savedSeccion });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSecciones = async (req, res) => {
  try {
    const secciones = await Seccion.find();
    return res.status(200).json({ success: true, secciones });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeccionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const seccion = await Seccion.findById(id);
    if (!seccion) {
      return res.status(404).json({ success: false, message: "Sección no encontrada" });
    }

    return res.status(200).json({ success: true, seccion });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSeccion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const updatedSeccion = await Seccion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSeccion) {
      return res.status(404).json({ success: false, message: "Sección no encontrada" });
    }

    return res.status(200).json({ success: true, seccion: updatedSeccion });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSeccion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const deletedSeccion = await Seccion.findByIdAndDelete(id);
    if (!deletedSeccion) {
      return res.status(404).json({ success: false, message: "Sección no encontrada" });
    }

    return res.status(200).json({ success: true, message: "Sección eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
