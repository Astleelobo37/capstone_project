const express = require('express');
const router = express.Router();
const maskController = require('../controllers/maskController');
const authController = require('../controllers/authController');

// Public routes
router.get('/', maskController.getAllMasks);
router.get('/:id', maskController.getMaskById);
router.get('/severity/:severity', maskController.getMasksBySeverity);
router.get('/price-range', maskController.getMasksByPriceRange);

// Protected routes (require authentication)
router.put('/:id/stock', authController.verifyToken, maskController.updateMaskStock);
router.post('/', authController.verifyToken, maskController.createMask);
router.put('/:id', authController.verifyToken, maskController.updateMask);
router.delete('/:id', authController.verifyToken, maskController.deleteMask);

module.exports = router; 