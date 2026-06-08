const mongoose = require("mongoose");
const Resena = require("../models/Reseñas");

exports.createResena = async (req, res) => {
  try {
    const resena = new Resena(req.body);
    const savedResena = await resena.save();
    return res.status(201).json({ success: true, resena: savedResena });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getResenas = async (req, res) => {
  try {
    const resenas = await Resena.find();
    return res.status(200).json({ success: true, resenas });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getResenaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const resena = await Resena.findById(id);
    if (!resena) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    return res.status(200).json({ success: true, resena });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateResena = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const updatedResena = await Resena.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedResena) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    return res.status(200).json({ success: true, resena: updatedResena });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteResena = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const deletedResena = await Resena.findByIdAndDelete(id);
    if (!deletedResena) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    return res.status(200).json({ success: true, message: "Reseña eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
