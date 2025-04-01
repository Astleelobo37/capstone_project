const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

// GET all users
router.get("/", (req, res) => {
  Controllers.userController.getUsers(res);
});

// GET user by ID with their test results
router.get("/:id", (req, res) => {
  Controllers.userController.getUserDetails(req, res);
});

// POST create new user
router.post("/", (req, res) => {
  Controllers.userController.createUser(req.body, res);
});

// PUT update user
router.put("/:id", (req, res) => {
  Controllers.userController.updateUser(req, res);
});

// DELETE user
router.delete("/:id", (req, res) => {
  Controllers.userController.deleteUser(req, res);
});

module.exports = router; 