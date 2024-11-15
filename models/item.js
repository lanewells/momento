const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, 
      trim: true, // Removes extra whitespace
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    src: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Item", ItemSchema);