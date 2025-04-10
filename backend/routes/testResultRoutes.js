const express = require("express");
const router = express.Router();
const testResultController = require("../controllers/testResultController");
const authController = require("../controllers/authController");

// Public routes
router.get("/", testResultController.getAllTestResults);
router.get("/status", testResultController.getTestResultsByStatus);
router.get("/:id", testResultController.getTestResultDetails);

// User-specific routes (protected)
router.get("/user/:userId", authController.verifyToken, testResultController.getTestResultsByUserId);
router.get("/:userId/latest", authController.verifyToken, testResultController.getLatestTestResultByUserId);

// Test result creation and management (protected)
router.post("/", authController.verifyToken, testResultController.createTestResult);
router.post("/upload", authController.verifyToken, testResultController.uploadTestResult);
router.put("/:id", authController.verifyToken, testResultController.updateTestResult);
router.delete("/:id", authController.verifyToken, testResultController.deleteTestResult);

// GET user by ID with their test results
router.get("/:id", (req, res) => {
  Controllers.testResultController.gettestResultDetails(req, res);
});

// POST create new user
router.post("/", (req, res) => {
  Controllers.testResultController.createtestResult(req.body, res);
});

// PUT update user
router.put("/:id", (req, res) => {
  Controllers.testResultController.updatetestResult(req, res);
});

// DELETE user
router.delete("/:id", (req, res) => {
  Controllers.testResultController.deletetestResult(req, res);
});


module.exports = router; 