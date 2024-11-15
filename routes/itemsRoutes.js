const express = require("express");
const router = express.Router();
const ItemsController = require("../controllers/itemsController");

// CRUD routes
router.post("/", ItemsController.createItem);        
router.get("/", ItemsController.getAllItems);       
router.get("/:id", ItemsController.getItemById);    
router.put("/:id", ItemsController.updateItem);     
router.delete("/:id", ItemsController.deleteItem); 

module.exports = router;
