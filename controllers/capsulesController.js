const express = require("express")
const router = express.Router()
const Capsule = require("../models/capsule")
const mongoose = require("mongoose")
const User = require("../models/user")

router.get("/", async (req, res) => {
  try {
    const capsules = await Capsule.find()
      .populate("sender", "username")
      .populate("recipient", "username")
    res.status(200).json(capsules)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve capsules", details: error.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid capsule id." })
    }

    const capsule = await Capsule.findById(id)
      .populate("sender", "username")
      .populate("recipient", "username")

    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" })
    }

    res.status(200).json(capsule)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve capsule", details: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const { sender, recipient, sealDate, releaseDate, status } = req.body

    if (!recipient || !releaseDate) {
      return res.status(400).json({
        error: "Release Date and Recipient are required fields.",
      })
    }

    if (!mongoose.Types.ObjectId.isValid(recipient)) {
      return res.status(400).json({ error: "Invalid recipient ID." })
    }

    const recipientUser = await User.findById(recipient)
    if (!recipientUser) {
      return res.status(404).json({ error: "Recipient not found." })
    }

    if (!mongoose.Types.ObjectId.isValid(sender)) {
      return res.status(400).json({ error: "Invalid sender ID." })
    }

    const senderUser = await User.findById(sender)
    if (!senderUser) {
      return res.status(404).json({ error: "Sender not found." })
    }

    const newCapsule = await Capsule.create({
      sender: senderUser._id,
      recipient: recipientUser._id,
      sealDate,
      releaseDate,
      status,
    })
    res.status(201).json(newCapsule)
  } catch (error) {
    console.error("Error creating capsule:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { sender, recipient, sealDate, releaseDate, status } = req.body

    if (!mongoose.Types.ObjectId.isValid(recipient)) {
      return res.status(400).json({ error: "Invalid recipient ID." })
    }

    const recipientUser = await User.findById(recipient)
    if (!recipientUser) {
      return res.status(404).json({ error: "Recipient not found." })
    }

    if (!mongoose.Types.ObjectId.isValid(sender)) {
      return res.status(400).json({ error: "Invalid sender ID." })
    }

    const senderUser = await User.findById(sender)
    if (!senderUser) {
      return res.status(404).json({ error: "Sender not found." })
    }

    const updatedCapsule = await Capsule.findByIdAndUpdate(
      id,
      {
        sender: senderUser._id,
        recipient: recipientUser._id,
        sealDate,
        releaseDate,
        status,
      },
      { new: true, runValidators: true }
    )

    if (!updatedCapsule) {
      return res.status(404).json({ error: "Capsule not found" })
    }

    res.status(200).json(updatedCapsule)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update capsule", details: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deletedCapsule = await Capsule.findByIdAndDelete(id)

    if (!deletedCapsule) {
      return res.status(404).json({ error: "Capsule not found" })
    }

    res.status(204).send()
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete capsule", details: error.message })
  }
})

module.exports = router
