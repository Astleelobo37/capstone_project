"use strict";

// Temporary hardcoded masks for testing
const masks = [
  {
    id: 1,
    maskType: "N95",
    stock: 100,
    serialNumber: "N95-001",
    orderDate: "2024-04-05",
    description: "GOLD 1 - Mild: N95 Respirator Mask with high filtration efficiency",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    maskType: "KN95",
    stock: 150,
    serialNumber: "KN95-001",
    orderDate: "2024-04-05",
    description: "GOLD 2 - Moderate: KN95 Protective Mask with comfortable ear loops",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    maskType: "Fisher & Paykel Full Face Mask",
    stock: 75,
    serialNumber: "FP-001",
    orderDate: "2024-04-05",
    description: "GOLD 1 - Mild: Fisher & Paykel Full Face Mask with advanced seal technology",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    maskType: "Fisher & Paykel Nasal Mask",
    stock: 60,
    serialNumber: "FP-002",
    orderDate: "2024-04-05",
    description: "GOLD 2 - Moderate: Fisher & Paykel Nasal Mask with comfort gel cushion",
    price: 179.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    maskType: "Fisher & Paykel Full Face Mask Humidifier",
    stock: 45,
    serialNumber: "FP-003",
    orderDate: "2024-04-05",
    description: "GOLD 3 - Severe: Fisher & Paykel Full Face Mask with heated humidifier",
    price: 249.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    maskType: "Fisher & Paykel Nasal Pillow Mask",
    stock: 30,
    serialNumber: "FP-004",
    orderDate: "2024-04-05",
    description: "GOLD 4 - Very Severe: Fisher & Paykel Nasal Pillow Mask with minimal contact",
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    maskType: "Fisher & Paykel Full Face Mask Cushion",
    stock: 25,
    serialNumber: "FP-005",
    orderDate: "2024-04-05",
    description: "GOLD 1 - Mild: Fisher & Paykel Full Face Mask with memory foam cushion",
    price: 229.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    maskType: "Fisher & Paykel Nasal Mask with Valve",
    stock: 20,
    serialNumber: "FP-006",
    orderDate: "2024-04-05",
    description: "GOLD 2 - Moderate: Fisher & Paykel Nasal Mask with anti-asphyxia valve",
    price: 189.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 9,
    maskType: "Integrated Fisher & Paykel Full Face Mask",
    stock: 15,
    serialNumber: "FP-007",
    orderDate: "2024-04-05",
    description: "GOLD 3 - Severe: Fisher & Paykel Full Face Mask with integrated humidifier",
    price: 279.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 10,
    maskType: "Fisher & Paykel Nasal Pillow Mask Silicone",
    stock: 10,
    serialNumber: "FP-008",
    orderDate: "2024-04-05",
    description: "GOLD 4 - Very Severe: Fisher & Paykel Nasal Pillow Mask with ultra-soft silicone",
    price: 169.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 11,
    maskType: "ResMed AirFit F20",
    stock: 50,
    serialNumber: "RM-001",
    orderDate: "2024-04-05",
    description: "ResMed - Full Face Mask with memory foam cushion",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 12,
    maskType: "ResMed AirFit N20",
    stock: 45,
    serialNumber: "RM-002",
    orderDate: "2024-04-05",
    description: "ResMed - Nasal Mask with magnetic clips",
    price: 179.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 13,
    maskType: "ResMed AirFit P10",
    stock: 40,
    serialNumber: "RM-003",
    orderDate: "2024-04-05",
    description: "ResMed - Nasal Pillow Mask with minimal contact",
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 14,
    maskType: "ResMed AirTouch F20",
    stock: 35,
    serialNumber: "RM-004",
    orderDate: "2024-04-05",
    description: "ResMed - Full Face Mask with memory foam cushion",
    price: 229.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 15,
    maskType: "ResMed AirTouch N20",
    stock: 30,
    serialNumber: "RM-005",
    orderDate: "2024-04-05",
    description: "ResMed - Nasal Mask with memory foam cushion",
    price: 209.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 16,
    maskType: "ResMed Mirage Quattro",
    stock: 25,
    serialNumber: "RM-006",
    orderDate: "2024-04-05",
    description: "ResMed - Full Face Mask with 4-point headgear",
    price: 189.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 17,
    maskType: "ResMed Mirage FX",
    stock: 20,
    serialNumber: "RM-007",
    orderDate: "2024-04-05",
    description: "ResMed - Nasal Mask with quick-release clips",
    price: 169.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 18,
    maskType: "ResMed Swift FX",
    stock: 15,
    serialNumber: "RM-008",
    orderDate: "2024-04-05",
    description: "ResMed - Nasal Pillow Mask with rotating elbow",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 19,
    maskType: "ResMed Mirage Liberty",
    stock: 10,
    serialNumber: "RM-009",
    orderDate: "2024-04-05",
    description: "ResMed - Hybrid Mask with nasal pillows and mouth cushion",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  },
  {
    id: 20,
    maskType: "ResMed Mirage Quattro FX",
    stock: 5,
    serialNumber: "RM-010",
    orderDate: "2024-04-05",
    description: "ResMed - Full Face Mask with advanced seal technology",
    price: 219.99,
    imageUrl: "https://images.unsplash.com/photo-1584634731339-252c58abf4e6?w=800&auto=format&fit=crop"
  }
];

// Get all masks
const getAllMasks = async (req, res) => {
  try {
    console.log('Received request for all masks');
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