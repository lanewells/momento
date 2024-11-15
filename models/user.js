// Imports
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

// User Model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
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
  },
  {
    timestamps: true,
  }
)

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next()
  try {
    const saltRounds = 10
    this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds)
    next()
  } catch (error) {
    next(error)
  }
})

// Confirm passwords
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash)
}

// Export model
module.exports = mongoose.model("User", userSchema)
