const mongoose = require("mongoose");
const Curso = require("../models/Cursos");

exports.createCurso = async (req, res) => {
  try {
    const curso = new Curso(req.body);
    const savedCurso = await curso.save();
    return res.status(201).json({ success: true, curso: savedCurso });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    return res.status(200).json({ success: true, cursos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCursoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    return res.status(200).json({ success: true, curso });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const updatedCurso = await Curso.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCurso) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    return res.status(200).json({ success: true, curso: updatedCurso });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const deletedCurso = await Curso.findByIdAndDelete(id);
    if (!deletedCurso) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    return res.status(200).json({ success: true, message: "Curso eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
