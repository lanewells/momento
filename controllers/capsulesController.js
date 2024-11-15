const express = require("express")
const router = express.Router()
const Capsule = require("../models/capsule")

// Get all capsules
exports.getAllCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find()
    res.status(200).json(capsules)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve capsules", details: error.message })
  }
}

// Get a single capsule by id
exports.getCapsuleById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid capsule id." })
    }
    const capsule = await Capsule.findById(id)

    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" })
    }

    res.status(200).json(capsule)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve capsule", details: error.message })
  }
}

// Create a new capsule
exports.createCapsule = async (req, res) => {
  try {
    const { sender, recipient, sealDate, releaseDate, status, items } = req.body

    if (!sender || !releaseDate || !items || items.length === 0) {
      return res.status(400).json({
        error: "Sender, Release Date, and Items are required fields."
      })
    }

    const newCapsule = await Capsule.create({
      sender,
      recipient,
      sealDate,
      releaseDate,
      status,
      items
    })
    res.status(201).json(newCapsule)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create capsule", details: error.message })
  }
}

// Update a capsule by id
exports.updateCapsule = async (req, res) => {
  try {
    const { id } = req.params
    const { sender, recipient, sealDate, releaseDate, status, items } = req.body

    const updatedCapsule = await Capsule.findByIdAndUpdate(
      id,
      { sender, recipient, sealDate, releaseDate, status, items },
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
}

// Delete a capsule by id
exports.deleteCapsule = async (req, res) => {
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
}
