const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const checkAdmin = require('../helpers/checkAdmin')

// Routes mapping to controller methods
router.post('/newproduct', checkAdmin, productController.createProduct);
router.get('/productlist', productController.getAllProducts);
router.get('/productnames', productController.getProductNames);
router.put('/', checkAdmin, productController.updateProduct);
router.delete('/',checkAdmin, productController.deleteProduct);
router.get('/count', productController.getProductCount);
router.get('/featured', productController.getFeaturedProducts);
router.get('/filtered', productController.getFilteredProducts);
router.get('/:id', productController.getProductById);


module.exports = router;


