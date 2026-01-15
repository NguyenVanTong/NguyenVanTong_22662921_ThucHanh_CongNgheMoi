// Product Routes - Using MVC Pattern
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');

// All product routes require authentication
router.use(requireAuth);

// Display all products
router.get('/', ProductController.index);

// Create product
router.post('/add', ProductController.create);

// Update product
router.post('/update', ProductController.update);

// Delete product
router.post('/delete', ProductController.delete);

module.exports = router;
