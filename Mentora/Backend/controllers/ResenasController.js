const mongoose = require("mongoose");
const Resena = require("../models/Reseñas");
const Curso = require("../models/Cursos");
const Inscripcion = require("../models/Inscripciones");

const recalcularPromedio = async (curso_id) => {
  const resultado = await Resena.aggregate([
    { $match: { curso_id: new mongoose.Types.ObjectId(curso_id) } },
    { $group: { _id: null, promedio: { $avg: "$calificacion" } } }
  ]);
  const promedio = Math.round((resultado[0]?.promedio || 0) * 10) / 10;
  await Curso.findByIdAndUpdate(curso_id, { calificacion_promedio: promedio });
};

exports.createResena = async (req, res) => {
  try {
    const { curso_id, calificacion, comentario } = req.body;

    if (!curso_id || calificacion === undefined) {
      return res.status(400).json({
        success: false,
        message: "curso_id y calificacion son requeridos"
      });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({
        success: false,
        message: "La calificación debe estar entre 1 y 5"
      });
    }

    const inscripcion = await Inscripcion.findOne({
      estudiante_id: req.user.id,
      curso_id
    });
    if (!inscripcion) {
      return res.status(403).json({
        success: false,
        message: "Solo los estudiantes inscritos pueden dejar una reseña"
      });
    }

    const yaResenada = await Resena.findOne({
      estudiante_id: req.user.id,
      curso_id
    });
    if (yaResenada) {
      return res.status(400).json({
        success: false,
        message: "Ya has dejado una reseña para este curso"
      });
    }

    const resena = new Resena({
      estudiante_id: req.user.id,
      curso_id,
      calificacion,
      comentario: comentario || ""
    });

    const savedResena = await resena.save();

    await recalcularPromedio(curso_id);

    return res.status(201).json({ success: true, resena: savedResena });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getResenasByCurso = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const resenas = await Resena.find({ curso_id: id })
      .populate("estudiante_id", "nombre foto")
      .sort("-createdAt");

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

    const resena = await Resena.findById(id)
      .populate("estudiante_id", "nombre foto");
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

    const resena = await Resena.findById(id);
    if (!resena) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    if (resena.estudiante_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Solo puedes modificar tus propias reseñas"
      });
    }

    if (req.body.calificacion !== undefined && (req.body.calificacion < 1 || req.body.calificacion > 5)) {
      return res.status(400).json({
        success: false,
        message: "La calificación debe estar entre 1 y 5"
      });
    }

    delete req.body.estudiante_id;
    delete req.body.curso_id;

    const updatedResena = await Resena.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    await recalcularPromedio(resena.curso_id);

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

    const resena = await Resena.findById(id);
    if (!resena) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    if (resena.estudiante_id.toString() !== req.user.id && req.user.rol !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar esta reseña"
      });
    }

    const curso_id = resena.curso_id;
    await Resena.findByIdAndDelete(id);

    await recalcularPromedio(curso_id);

    return res.status(200).json({
      success: true,
      message: "Reseña eliminada correctamente"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};