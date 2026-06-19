const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    tags: {
      type: [String],
      default: [],
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "documents"
  }
);

module.exports = mongoose.model("Document", documentSchema, "documents");
