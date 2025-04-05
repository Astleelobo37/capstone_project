"use strict";
const { TestResult, User } = require('../models');

// Get all test results
const getAllTestResults = async (req, res) => {
  try {
    const testResults = await TestResult.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email', 'NHI'] }]
    });
    return res.status(200).json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get test results by user ID
const getTestResultsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const testResults = await TestResult.findAll({
      where: { userId },
      order: [['test_date', 'DESC']]
    });

    return res.status(200).json(testResults);
  } catch (error) {
    console.error('Error fetching user test results:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get latest test result by user ID
const getLatestTestResultByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const testResult = await TestResult.findOne({
      where: { userId },
      order: [['test_date', 'DESC']]
    });

    if (!testResult) {
      return res.status(404).json({ message: 'No test results found for this user' });
    }

    return res.status(200).json(testResult);
  } catch (error) {
    console.error('Error fetching latest test result:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a new test result
const createTestResult = async (req, res) => {
  try {
    const { userId, result, status, clinicalNotes } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const testResult = await TestResult.create({
      userId,
      test_date: new Date(),
      result,
      status,
      clinical_notes: clinicalNotes
    });

    return res.status(201).json({
      message: 'Test result created successfully',
      testResult
    });
  } catch (error) {
    console.error('Error creating test result:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Upload a test result with file (simulated)
const uploadTestResult = async (req, res) => {
  try {
    // In a real application, you would:
    // 1. Process the uploaded file
    // 2. Extract test results from the file or store it
    // 3. Create a test result record with a reference to the file

    const { userId, severity } = req.body;
    
    // Simulated results based on severity
    let result = '';
    switch (severity) {
      case 'GOLD 1 - Mild':
        result = 'FEV1: 80% predicted, FVC: 85%, SpO2: 95%';
        break;
      case 'GOLD 2 - Moderate':
        result = 'FEV1: 60% predicted, FVC: 75%, SpO2: 92%';
        break;
      case 'GOLD 3 - Severe':
        result = 'FEV1: 45% predicted, FVC: 60%, SpO2: 88%';
        break;
      case 'GOLD 4 - Very Severe':
        result = 'FEV1: 25% predicted, FVC: 45%, SpO2: 84%';
        break;
      default:
        result = 'FEV1: 70% predicted, FVC: 80%, SpO2: 94%';
    }

    const testResult = await TestResult.create({
      userId,
      test_date: new Date(),
      result,
      status: severity,
      clinical_notes: `Uploaded test results showing ${severity} COPD.`
    });

    return res.status(201).json({
      message: 'Test result uploaded successfully',
      testResult
    });
  } catch (error) {
    console.error('Error uploading test result:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// uses JSON from request body to update test result ID from params
const updateTestResult = (req, res) => {
  TestResult.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  })
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// deletes test result matching ID from params
const deleteTestResult = (req, res) => {
  TestResult.destroy({ where: { id: req.params.id } })
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// finds test result by ID with all details
const getTestResultDetails = (req, res) => {
  TestResult.findByPk(req.params.id, {
    include: [{
      model: User,
      attributes: ['id', 'name', 'email']
    }]
  })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// finds test results by status
const getTestResultsByStatus = (req, res) => {
  const { status } = req.query;
  TestResult.findAll({
    where: {
      status: status
    },
    include: [{
      model: User,
      attributes: ['id', 'name', 'email']
    }]
  })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

module.exports = {
  getAllTestResults,
  getTestResultsByUserId,
  getLatestTestResultByUserId,
  createTestResult,
  uploadTestResult,
  updateTestResult,
  deleteTestResult,
  getTestResultDetails,
  getTestResultsByStatus
}; 