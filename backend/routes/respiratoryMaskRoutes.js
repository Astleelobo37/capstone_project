const express = require('express');
const router = express.Router();
const { getRespiratoryMasks } = require('../controllers/respiratoryMaskController');

router.get('/', getRespiratoryMasks);

module.exports = router; 