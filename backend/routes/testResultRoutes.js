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

module.exports = router; 