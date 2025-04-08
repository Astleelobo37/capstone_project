const Mask = require('../models/mask');

exports.getAllMasks = async (req, res) => {
  try {
    const masks = await Mask.getAll();
    res.json(masks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching masks', error: error.message });
  }
};

exports.getMaskById = async (req, res) => {
  try {
    const mask = await Mask.getById(req.params.id);
    if (!mask) {
      return res.status(404).json({ message: 'Mask not found' });
    }
    res.json(mask);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mask', error: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    await Mask.updateStock(req.params.id, stock);
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
}; 