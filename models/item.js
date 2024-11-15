const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, 
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    src: {
      type: String,
      trim: true,
      default: null,
    },
    altText: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Item", ItemSchema);