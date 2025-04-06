"use strict";
const { Mask } = require('../models');

// Get all masks
const getAllMasks = async (req, res) => {
  try {
    console.log('Received request for all masks');
    const masks = await Mask.findAll();
    console.log('Found masks:', JSON.stringify(masks, null, 2));
    if (!masks || masks.length === 0) {
      console.log('No masks found in database');
    }
    return res.status(200).json(masks);
  } catch (error) {
    console.error('Error fetching masks:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get mask by ID
const getMaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const mask = await Mask.findByPk(id);

    if (!mask) {
      return res.status(404).json({ message: 'Mask not found' });
    }

    return res.status(200).json(mask);
  } catch (error) {
    console.error('Error fetching mask:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Filter masks by COPD severity level
const getMasksBySeverity = async (req, res) => {
  try {
    const { severity } = req.params;
    
    if (!severity || !['1', '2', '3', '4'].includes(severity)) {
      return res.status(400).json({ message: 'Invalid severity level' });
    }

    const masks = await Mask.findAll();
    
    // Filter masks that contain the specified GOLD level in their description
    const filteredMasks = masks.filter(mask => {
      return mask.description.includes(`GOLD ${severity}`);
    });

    return res.status(200).json(filteredMasks);
  } catch (error) {
    console.error('Error filtering masks by severity:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update mask stock
const updateMaskStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const mask = await Mask.findByPk(id);

    if (!mask) {
      return res.status(404).json({ message: 'Mask not found' });
    }

    await mask.update({ stock });

    return res.status(200).json({ message: 'Mask stock updated successfully', mask });
  } catch (error) {
    console.error('Error updating mask stock:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// uses JSON from request body to create new respiratory mask in DB
const createMask = (data, res) => {
  Mask.create(data)
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
  Mask.update(req.body, {
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
  Mask.destroy({ where: { id: req.params.id } })
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

// finds respiratory masks by price range
const getMasksByPriceRange = (req, res) => {
  const { minPrice, maxPrice } = req.query;
  Mask.findAll({
    where: {
      price: {
        [Mask.sequelize.Op.between]: [minPrice, maxPrice]
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
  getAllMasks,
  getMaskById,
  getMasksBySeverity,
  updateMaskStock,
  createMask,
  updateMask,
  deleteMask,
  getMasksByPriceRange
}; 