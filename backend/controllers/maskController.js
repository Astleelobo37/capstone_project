"use strict";
const Models = require("../models");
const { Op } = require('sequelize');
function decodeQuery(query) {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => {
      const decoded = decodeURIComponent(value);
      return decoded.startsWith('!')
        ? [key, { [Op.not]: decoded.slice(1) }]
        : [key, decoded];
    })
  );
}
// Get all masks
const getAllMasks = async (req, res) => {
  try {
    console.log('Received request for all masks');
console.log(req.query)
    const masks = await Models.Mask.findAll({where:decodeQuery(req.query)})
    if (!masks || masks.length === 0) {
      console.log('No masks available');
      return res.status(200).json([]);
    }
    console.log('Returning hardcoded masks:', masks.length, 'masks');
    return res.status(200).json(masks);
  } catch (error) {
    console.error('Error fetching masks:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get mask by ID
const getMaskById = async (req, res) => {
  try {
    const maskId = parseInt(req.params.id);
    if (isNaN(maskId)) {
      return res.status(400).json({ message: 'Invalid mask ID' });
    }
    
    const mask = masks.find(m => m.id === maskId);
    if (!mask) {
      return res.status(404).json({ message: 'Mask not found' });
    }
    return res.status(200).json(mask);
  } catch (error) {
    console.error('Error fetching mask:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};




// Update mask stock fix to use database properly
const updateMaskStock = async (req, res) => {
  try {
    const maskId = parseInt(req.params.id);
    const { stock } = req.body;

    if (isNaN(maskId)) {
      return res.status(400).json({ message: 'Invalid mask ID' });
    }

    if (typeof stock !== 'number') {
      return res.status(400).json({ message: 'Stock must be a number' });
    }

    const maskIndex = masks.findIndex(m => m.id === maskId);
    if (maskIndex === -1) {
      return res.status(404).json({ message: 'Mask not found' });
    }

    // Update the mask stock
    masks[maskIndex].stock = stock;

    return res.status(200).json({
      message: 'Stock updated successfully',
      mask: masks[maskIndex]
    });
  } catch (error) {
    console.error('Error updating mask stock:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllMasks,
  getMaskById,
  updateMaskStock
}; 