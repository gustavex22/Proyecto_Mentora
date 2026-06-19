const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  estudiante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El ID del estudiante es obligatorio.'],
    validate: {
      validator: async function(valorId) {
        const usuario = await mongoose.model('Usuario').findById(valorId);
        return usuario && usuario.rol === 'estudiante';
      },
      message: 'El ID proporcionado no pertenece a un usuario con el rol de "estudiante".'
    }
  },
  curso_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'El ID del curso es obligatorio.']
  },
  calificacion: {
    type: Number,
    required: [true, 'La calificación es obligatoria.'],
    min: [1, 'La calificación mínima es 1.'],
    max: [5, 'La calificación máxima es 5.']
  },
  comentario: {
    type: String,
    trim: true, 
    default: ''
  }
}, {
  timestamps: true,
  collection: 'reseñas'
});

module.exports = mongoose.model('Resena', resenaSchema, 'reseñas');