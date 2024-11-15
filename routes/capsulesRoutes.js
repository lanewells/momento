const express = require("express")
const router = express.Router()
const capsulesController = require("../controllers/capsulesController")

// CRUD Routes for Capsules Controller
router.get("/", capsulesController.getAllCapsules)
router.get("/:id", capsulesController.getCapsuleById)
router.post("/", capsulesController.createCapsule)
router.put("/:id", capsulesController.updateCapsule)
router.delete("/:id", capsulesController.deleteCapsule)

module.exports = router
