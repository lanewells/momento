const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const SALT_ROUNDS = 12

// Signup
router.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username })
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." })
    }

    const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS)
    const user = new User({
      username: req.body.username,
      passwordHash,
      birthDate: req.body.birthDate,
    })
    await user.save()

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(201).json({ message: "User created successfully.", user, token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Signin
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." })
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    )
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password." })
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(200).json({ message: "Login successful.", token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
