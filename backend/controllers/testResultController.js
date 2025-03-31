"use strict";
const Models = require("../models");

// finds all test results in DB, then sends array as response
const getTestResults = (res) => {
  Models.TestResult.findAll({
    include: [{
      model: Models.User,
      attributes: ['id', 'name', 'email']
    }]
  })
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// uses JSON from request body to create new test result in DB
const createTestResult = (data, res) => {
  Models.TestResult.create(data)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// uses JSON from request body to update test result ID from params
const updateTestResult = (req, res) => {
  Models.TestResult.update(req.body, {
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
  Models.TestResult.destroy({ where: { id: req.params.id } })
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
  Models.TestResult.findByPk(req.params.id, {
    include: [{
      model: Models.User,
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
  Models.TestResult.findAll({
    where: {
      status: status
    },
    include: [{
      model: Models.User,
      attributes: ['id', 'name', 'email']
    }]
  })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// finds test results by user ID
const getUserTestResults = (req, res) => {
  Models.TestResult.findAll({
    where: {
      userId: req.params.userId
    }
  })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

module.exports = {
  getTestResults,
  createTestResult,
  updateTestResult,
  deleteTestResult,
  getTestResultDetails,
  getTestResultsByStatus,
  getUserTestResults
}; 