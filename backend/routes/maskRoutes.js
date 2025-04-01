const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

// GET all masks
router.get("/", (req, res) => {
  Controllers.maskController.getMasks(res);
});

// GET mask by ID
router.get("/:id", (req, res) => {
  Controllers.maskController.getMaskDetails(req, res);
});

// GET masks by user ID
router.get("/user/:userId", (req, res) => {
  Controllers.maskController.getUserMasks(req, res);
});

// POST create new mask
router.post("/", (req, res) => {
  Controllers.maskController.createMask(req.body, res);
});

// PUT update mask
router.put("/:id", (req, res) => {
  Controllers.maskController.updateMask(req, res);
});

// DELETE mask
router.delete("/:id", (req, res) => {
  Controllers.maskController.deleteMask(req, res);
});

module.exports = router; 