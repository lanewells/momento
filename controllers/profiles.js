const express = require("express")
const router = express.Router()
const User = require("../models/user")
const verifyToken = require("../middleware/authMiddleware")

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ error: "Access denied: Unauthorized." })
    }

    const user = await User.findById(req.user.id).select("-passwordHash")
    if (!user) {
      return res.status(404).json({ error: "Profile not found." })
    }

    res.status(200).json({ profile: user })
  } catch (error) {
    res.status(500).json({ error: "An internal server error occurred." })
  }
})

module.exports = router
