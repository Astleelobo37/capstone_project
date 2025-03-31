"use strict";
const Models = require("../models");

// finds all respiratory mask types in DB, then sends array as response
const getTypes = (res) => {
  Models.RespiratoryMaskType.findAll({})
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// uses JSON from request body to create new respiratory mask type in DB
const createType = (data, res) => {
  Models.RespiratoryMaskType.create(data)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// uses JSON from request body to update respiratory mask type ID from params
const updateType = (req, res) => {
  Models.RespiratoryMaskType.update(req.body, {
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

// deletes respiratory mask type matching ID from params
const deleteType = (req, res) => {
  Models.RespiratoryMaskType.destroy({ where: { id: req.params.id } })
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// finds respiratory mask type by ID with all details
const getTypeDetails = (req, res) => {
  Models.RespiratoryMaskType.findByPk(req.params.id, {
    include: [{
      model: Models.RespiratoryMask,
      attributes: ['id', 'name', 'price', 'imagePath']
    }]
  })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// finds respiratory mask types by category
const getTypesByCategory = (req, res) => {
  const { category } = req.query;
  Models.RespiratoryMaskType.findAll({
    where: {
      category: category
    }
  })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

module.exports = {
  getTypes,
  createType,
  updateType,
  deleteType,
  getTypeDetails,
  getTypesByCategory
}; 