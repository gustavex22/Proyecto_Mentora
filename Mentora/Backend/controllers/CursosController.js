const mongoose = require("mongoose");
const Curso = require("../models/Cursos");
const Seccion = require("../models/Secciones");
const Leccion = require("../models/Lecciones");
const Inscripcion = require("../models/Inscripciones");
const Resena = require("../models/Reseñas");

exports.createCurso = async (req, res) => {
  try {
    req.body.instructorID = req.user.id;

    const imagen = req.body.imagen;
    if (imagen && imagen.startsWith("data:")) {
      const sizeInBytes = Buffer.byteLength(imagen, "base64");
      if (sizeInBytes > 2 * 1024 * 1024) {
        return res.status(413).json({
          success: false,
          message: "La imagen excede el tamaño máximo de 2MB"
        });
      }
    }

    const curso = new Curso(req.body);
    const savedCurso = await curso.save();
    return res.status(201).json({ success: true, curso: savedCurso });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCursos = async (req, res) => {
  try {
    const { titulo, categoria, nivel } = req.query;
    const filter = {};

    if (!req.user || req.user.rol !== "instructor") {
      filter.publicado = true;
    }

    if (titulo) filter.titulo = { $regex: titulo, $options: "i" };
    if (categoria) filter.categoria = { $regex: categoria, $options: "i" };
    if (nivel) filter.nivel = nivel;

    const cursos = await Curso.find(filter)
      .populate("instructorID", "nombre foto")
      .select("-__v");

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

    const curso = await Curso.findById(id)
      .populate("instructorID", "nombre biografia foto redes_sociales")
      .lean();

    if (!curso) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    if (!curso.publicado) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    const secciones = await Seccion.find({ cursoID: id })
      .sort("orden")
      .lean();

    const seccionIds = secciones.map(s => s._id);
    const lecciones = await Leccion.find({ seccionID: { $in: seccionIds } })
      .sort("orden")
      .lean();

    const seccionesConLecciones = secciones.map(seccion => ({
      ...seccion,
      lecciones: lecciones.filter(l =>
        l.seccionID.toString() === seccion._id.toString()
      )
    }));

    return res.status(200).json({
      success: true,
      curso: { ...curso, secciones: seccionesConLecciones }
    });
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

    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    if (curso.instructorID.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Solo el instructor dueño puede editar este curso"
      });
    }

    const imagen = req.body.imagen;
    if (imagen && imagen.startsWith("data:")) {
      const sizeInBytes = Buffer.byteLength(imagen, "base64");
      if (sizeInBytes > 2 * 1024 * 1024) {
        return res.status(413).json({
          success: false,
          message: "La imagen excede el tamaño máximo de 2MB"
        });
      }
    }

    delete req.body.instructorID;

    const updatedCurso = await Curso.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ success: true, curso: updatedCurso });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.togglePublicado = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    if (curso.instructorID.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Solo el instructor dueño puede publicar/despublicar este curso"
      });
    }

    curso.publicado = !curso.publicado;
    await curso.save();

    return res.status(200).json({
      success: true,
      message: `Curso ${curso.publicado ? "publicado" : "despublicado"} exitosamente`,
      curso
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    if (curso.instructorID.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Solo el instructor dueño puede eliminar este curso"
      });
    }

    const secciones = await Seccion.find({ cursoID: id });
    const seccionIds = secciones.map(s => s._id);

    await Promise.all([
      Leccion.deleteMany({ seccionID: { $in: seccionIds } }),
      Seccion.deleteMany({ cursoID: id }),
      Inscripcion.deleteMany({ curso_id: id }),
      Resena.deleteMany({ curso_id: id }),
    ]);

    await Curso.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Curso eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};