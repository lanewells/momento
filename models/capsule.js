const mongoose = require("mongoose")

const capsuleSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  sealDate: { type: Date, required: false },
  releaseDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["sealed", "pending seal", "released"],
    default: "pending seal",
    required: false
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true }]
})

const Capsule = mongoose.model("Capsule", capsuleSchema)
module.exports = Capsule
