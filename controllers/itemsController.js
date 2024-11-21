const Item = require("../models/item")
const express = require("express")
const router = express.Router()

// Create a new item
router.post("/", async (req, res) => {
  try {
    const { type, capsule, text, hyperlink, hyperlinkDescription } = req.body;

    const newItem = new Item({
      type,
      capsule,
      text: type === "message" ? text : undefined,
      hyperlink: type === "hyperlink" ? hyperlink : undefined,
      hyperlinkDescription: type === "hyperlink" ? hyperlinkDescription : undefined,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create item." });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch items." });
  }
});

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
    const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update item." });
  }
});

// Delete an item by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete item." });
  }
});

module.exports = router