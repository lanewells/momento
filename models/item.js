const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  capsule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Capsule",
    required: true,
  },
  type: {
    type: String,
    enum: ["message", "hyperlink"],
    required: true,
  },
  text: {
    type: String,
    required: function () {
      return this.type === "message";
    },
  },
  hyperlink: {
    type: String,
    required: function () {
      return this.type === "hyperlink";
    },
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: "Invalid URL format.",
    },
  },
  hyperlinkDescription: {
    type: String,
    required: function () {
      return this.type === "hyperlink";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Item", itemSchema);
