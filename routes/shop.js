const express = require('express');
const shopController = require('../controllers/shop.js');
const router = express.Router();

router.get('/cart', shopController.getCart);

module.exports = router;
