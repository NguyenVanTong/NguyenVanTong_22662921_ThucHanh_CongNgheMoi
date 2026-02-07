const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');

router.post('/products', controller.create);
router.get('/products', controller.findAll);
router.get('/products/:id', controller.findOne);
router.put('/products/:id', controller.update);
router.delete('/products/:id', controller.delete);

module.exports = router;
