const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

const mockUser = {
  _id: "1",
  username: "testUser",
  passwordHash: "$2b$10$eW5yqEo1wn.QAqZ2N.QW9e2F3bN3vN4w1vUjO6p5vlJHLxygTOZvu",
  birthDate: new Date("1990-01-01")
}

router.get("/sign-token", (req, res) => {
  try {
    const token = jwt.sign(
      { id: mockUser._id, username: mockUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: "Failed to generate token." })
  }
})

router.post("/verify-token", (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header is missing." })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Token is missing." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.status(200).json({ message: "Token is valid.", decoded })
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." })
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." })
    }
    res.status(500).json({ error: "Failed to verify token." })
  }
})

module.exports = router
