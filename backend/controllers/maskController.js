"use strict";
const Models = require("../models");

// finds all respiratory masks in DB, then sends array as response
const getMasks = (res) => {
  Models.RespiratoryMask.findAll({})
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// uses JSON from request body to create new respiratory mask in DB
const createMask = (data, res) => {
  Models.RespiratoryMask.create(data)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// uses JSON from request body to update respiratory mask ID from params
const updateMask = (req, res) => {
  Models.RespiratoryMask.update(req.body, {
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

// deletes respiratory mask matching ID from params
const deleteMask = (req, res) => {
  Models.RespiratoryMask.destroy({ where: { id: req.params.id } })
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// finds respiratory mask by ID with all details
const getMaskDetails = (req, res) => {
  Models.RespiratoryMask.findByPk(req.params.id)
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// finds respiratory masks by price range
const getMasksByPriceRange = (req, res) => {
  const { minPrice, maxPrice } = req.query;
  Models.RespiratoryMask.findAll({
    where: {
      price: {
        [Models.Sequelize.Op.between]: [minPrice, maxPrice]
      }
    }
  })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

module.exports = {
  getMasks,
  createMask,
  updateMask,
  deleteMask,
  getMaskDetails,
  getMasksByPriceRange
}; 