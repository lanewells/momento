const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/authMiddleware")

const SALT_ROUNDS = 12

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password, birthDate } = req.body
    if (!username || !password || !birthDate) {
      return res.status(400).json({ error: "All fields are required." })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = new User({ username, passwordHash, birthDate })
    await user.save()

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(201).json({
      message: "User created successfully.",
      user: {
        username: user.username,
        birthDate: user.birthDate,
        id: user._id
      },
      token
    })
  } catch (error) {
    console.error("Signup error:", error.message)
    res.status(500).json({ error: error.message })
  }
})

// Signin
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Both username and password are required." })
    }

    const user = await User.findOne({ username })
    if (!user) {
      console.log("Signin failed: User not found")
      return res.status(401).json({ error: "Invalid username or password." })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      console.log("Signin failed: Invalid password for user", username)
      return res.status(401).json({ error: "Invalid username or password." })
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(200).json({
      message: "Login successful.",
      user: {
        username: user.username,
        birthDate: user.birthDate,
        id: user._id
      },
      token
    })
  } catch (error) {
    console.error("Signin error:", error.message)
    res.status(500).json({ error: error.message })
  }
})

// Delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own account." })
    }

    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." })
    }

    res.status(200).json({ message: "Account deleted successfully." })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account." })
  }
})

// Update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ error: "You can only edit your own account." })
    }

    const { username, birthDate } = req.body

    if (!username && !birthDate) {
      return res.status(400).json({ error: "No fields to update provided." })
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, birthDate },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." })
    }

    res.status(200).json({
      message: "User updated successfully.",
      user: {
        username: updatedUser.username,
        birthDate: updatedUser.birthDate,
        id: updatedUser._id,
      },
    })
  } catch (error) {
    console.error("Edit user error:", error.message)
    res.status(500).json({ error: "Failed to udpate user." })
  }
})

// Get users
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve users", details: error.message })

module.exports = router
