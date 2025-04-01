const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

// GET all test results
router.get("/", (req, res) => {
  Controllers.testResultController.getTestResults(res);
});

// GET test result by ID
router.get("/:id", (req, res) => {
  Controllers.testResultController.getTestResultDetails(req, res);
});

// GET test results by user ID
router.get("/user/:userId", (req, res) => {
  Controllers.testResultController.getUserTestResults(req, res);
});

// GET test results by status
router.get("/status/:status", (req, res) => {
  Controllers.testResultController.getTestResultsByStatus(req, res);
});

// POST create new test result
router.post("/", (req, res) => {
  Controllers.testResultController.createTestResult(req.body, res);
});

// PUT update test result
router.put("/:id", (req, res) => {
  Controllers.testResultController.updateTestResult(req, res);
});

// DELETE test result
router.delete("/:id", (req, res) => {
  Controllers.testResultController.deleteTestResult(req, res);
});

module.exports = router; 