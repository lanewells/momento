// Imports
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

// User Model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username is already taken."],
      required: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_-]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
      validate: {
        validator: (date) => date < Date.now(),
        message: "Birth date must be in the past.",
      },
    },
    notifications: [
      {
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Confirm passwords
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash)
}

// Export model
module.exports = mongoose.model("User", userSchema)
