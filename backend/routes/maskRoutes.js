const express = require('express');
const router = express.Router();
const maskController = require('../controllers/maskController');
const authController = require('../controllers/authController');

// Public routes
router.get('/', (req, res, next) => {
  console.log('GET /api/masks route hit');
  maskController.getAllMasks(req, res).catch(next);
});

router.get('/:id', (req, res, next) => {
  console.log('GET /api/masks/:id route hit', req.params.id);
  maskController.getMaskById(req, res).catch(next);
});

router.get('/severity/:severity', (req, res, next) => {
  console.log('GET /api/masks/severity/:severity route hit', req.params.severity);
  maskController.getMasksBySeverity(req, res).catch(next);
});

router.get('/price-range', (req, res, next) => {
  console.log('GET /api/masks/price-range route hit', req.query);
  maskController.getMasksByPriceRange(req, res).catch(next);
});

// Protected route for updating mask stock
router.put('/:id/stock', authController.verifyToken, (req, res, next) => {
  console.log('PUT /api/masks/:id/stock route hit', req.params.id, req.body);
  maskController.updateMaskStock(req, res).catch(next);
});

module.exports = router; 