const Curso = require("../models/Cursos");

exports.getDashboardInstructor = async (req, res) => {
  try {
    const cursos = await Curso.find({ instructorID: req.user.id })
      .select("titulo imagen nivel categoria precio publicado calificacion_promedio total_inscritos")
      .sort("-createdAt");

    const totalEstudiantes = cursos.reduce((sum, c) => sum + c.total_inscritos, 0);
    const promedioGlobal = cursos.length > 0
      ? Math.round((cursos.reduce((sum, c) => sum + c.calificacion_promedio, 0) / cursos.length) * 10) / 10
      : 0;

    return res.status(200).json({
      success: true,
      resumen: {
        total_cursos: cursos.length,
        cursos_publicados: cursos.filter(c => c.publicado).length,
        total_estudiantes,
        calificacion_promedio_global: promedioGlobal
      },
      cursos
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardEstudiante = async (req, res) => {
  try {
    const Inscripcion = require("../models/Inscripciones");

    const inscripciones = await Inscripcion.find({ estudiante_id: req.user.id })
      .populate("curso_id", "titulo imagen nivel categoria precio instructorID")
      .populate({
        path: "curso_id",
        populate: { path: "instructorID", select: "nombre foto" }
      })
      .select("curso_id porcentaje fecha_inscripcion progreso")
      .sort("-fecha_inscripcion");

    const totalCursos = inscripciones.length;
    const cursosCompletados = inscripciones.filter(i => i.porcentaje === 100).length;
    const progresoPromedio = totalCursos > 0
      ? Math.round(inscripciones.reduce((sum, i) => sum + i.porcentaje, 0) / totalCursos)
      : 0;

    return res.status(200).json({
      success: true,
      resumen: {
        total_cursos: totalCursos,
        cursos_completados: cursosCompletados,
        progreso_promedio: progresoPromedio
      },
      inscripciones
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};