"use strict";
const Models = require("../models");
// Get all masks
const getAllMasks = async (req, res) => {
  try {
    console.log('Received request for all masks');
    const masks = await Models.Mask.findAll({})
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

// Get masks by severity
const getMasksBySeverity = async (req, res) => {
  try {
    const severity = req.params.severity;
    if (!severity) {
      return res.status(400).json({ message: 'Severity parameter is required' });
    }
    
    const filteredMasks = masks.filter(mask => 
      mask.description.toLowerCase().includes(severity.toLowerCase())
    );
    return res.status(200).json(filteredMasks);
  } catch (error) {
    console.error('Error fetching masks by severity:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get masks by price range
const getMasksByPriceRange = async (req, res) => {
  try {
    const { min, max } = req.query;
    if (!min || !max) {
      return res.status(400).json({ message: 'Both min and max price are required' });
    }
    
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);
    
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ message: 'Invalid price range' });
    }
    
    const filteredMasks = masks.filter(mask => 
      mask.price >= minPrice && mask.price <= maxPrice
    );
    return res.status(200).json(filteredMasks);
  } catch (error) {
    console.error('Error fetching masks by price range:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update mask stock
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
  getMasksBySeverity,
  getMasksByPriceRange,
  updateMaskStock
}; 