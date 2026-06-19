const mongoose = require("mongoose");

const seccionSchema = new mongoose.Schema(
  {
    cursoID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso',
      required: true
    },
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    orden: {
      type: Number,
      default: 0,
      min: 0
    },
  },
  {
    timestamps: true,
    collection: "secciones"
  }
);

module.exports = mongoose.model("Seccion", seccionSchema, "secciones");
