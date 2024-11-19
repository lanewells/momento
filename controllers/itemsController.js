const Item = require("../models/item")
const express = require("express")
const router = express.Router()

// Create a new item
router.post("/", async (req, res) => {
  try {
    const { type, text, src, altText } = req.body

    if (!type || !text) {
      return res.status(400).json({ error: "Type and text are required." })
    }

    const newItem = await Item.create({ type, text, src, altText })
    res.status(201).json(newItem)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create item", details: error.message })
  }
})

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find()
    res.status(200).json(items)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve items", details: error.message })
  }
})

// Get a single item by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const item = await Item.findById(id)

    if (!item) {
      return res.status(404).json({ error: "Item not found" })
    }

    res.status(200).json(item)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve item", details: error.message })
  }
})

// Update an item by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { type, text, src, altText } = req.body

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { type, text, src, altText },
      { new: true, runValidators: true }
    )

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" })
    }

    res.status(200).json(updatedItem)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update item", details: error.message })
  }
})

// Delete an item by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deletedItem = await Item.findByIdAndDelete(id)

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" })
    }

    res.status(204).send()
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete item", details: error.message })
  }
})

module.exports = router