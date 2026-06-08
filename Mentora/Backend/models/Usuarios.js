const mongoose = require("mongoose");

const usuario = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    correo: {
      type: String,
      required:true,
      unique:true,
      lowercase:true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    rol: {
      type: String,
      enum: ["instructor","estudiante"],
      default: "estudiante"
    },
    biografia: {
      type: String,
      default : ""
    },
    foto:{
        type: String,
        default: null
    },
    activo:{
        type: Boolean,
        default: true
    },
    createdAT:{
        type: Date,
        default: Date.now
    }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Usuario", usuario);
