const express = require('express');
const router = express.Router();
const maskController = require('../controllers/maskController');

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

module.exports = router; 