const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const checkAdmin = require('../helpers/checkAdmin');

router.get('/', categoryController.getAllCategories);
router.get('/getbyid', categoryController.getCategoryById); // or make it `/id/:id` for better practice
router.post('/', checkAdmin, categoryController.createCategory);
router.delete('/', checkAdmin, categoryController.deleteCategory);
router.put('/', checkAdmin, categoryController.updateCategory);

module.exports = router;
    