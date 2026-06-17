const mongoose = require("mongoose");
const Inscripcion = require("../models/Inscripciones");

exports.createInscripcion = async (req, res) => {
  try {
    const inscripcion = new Inscripcion(req.body);
    const savedInscripcion = await inscripcion.save();
    return res.status(201).json({ success: true, inscripcion: savedInscripcion });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find();
    return res.status(200).json({ success: true, inscripciones });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInscripcionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const inscripcion = await Inscripcion.findById(id);
    if (!inscripcion) {
      return res.status(404).json({ success: false, message: "Inscripción no encontrada" });
    }

    return res.status(200).json({ success: true, inscripcion });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const updatedInscripcion = await Inscripcion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedInscripcion) {
      return res.status(404).json({ success: false, message: "Inscripción no encontrada" });
    }

    return res.status(200).json({ success: true, inscripcion: updatedInscripcion });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const deletedInscripcion = await Inscripcion.findByIdAndDelete(id);
    if (!deletedInscripcion) {
      return res.status(404).json({ success: false, message: "Inscripción no encontrada" });
    }

    return res.status(200).json({ success: true, message: "Inscripción eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
