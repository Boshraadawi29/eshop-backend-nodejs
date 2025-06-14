const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Product } = require('../models/product');
const { Category } = require('../models/category');

// Create New Product
router.post(`/newproduct`, async (req, res) => {
  category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).json({ message: 'Invalid Category' });
  }
  const new_product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
  });

  //promise, save function is asynch, then means if it success, chatch means if any error
  new_product
    .save()
    .then((createdProduct) => {
      res.status(201).json({
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// Get Product by ID (from query instead of body is more standard)
router.get('/', async (req, res) => {
  const { id } = req.query;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Get All Products
router.get('/productlist', async (req, res) => {
  try {
    const productList = await Product.find();
    res.json({ success: true, data: productList });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch products', error });
  }
});

// Get Product Names and Descriptions
router.get('/productnames', async (req, res) => {
  try {
    const productList = await Product.find().select('name description -_id');
    res.json({ success: true, data: productList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product names',
      error,
    });
  }
});

// Get Product with Category Populated
router.get('/productwithcategory', async (req, res) => {
  const { id } = req.query;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id).populate('category');
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching product', error });
  }
});

// Update Product
router.put('/', async (req, res) => {
  const { id, category: categoryId } = req.body;

  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(categoryId)) {
    return res.status(400).json({ success: false, message: 'Invalid ID(s)' });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid category ID' });

    const updateFields = {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: categoryId,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    };
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
      },
    );
    if (!updatedProduct)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to update product', error });
  }
});

// Delete Product
router.delete('/', async (req, res) => {
  const { id } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: deletedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete product', error });
  }
});

// Get Product Count
router.get('/count', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to count products', error });
  }
});

// Get Featured Products
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    if (featuredProducts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No featured products found' });
    }
    res.json({ success: true, data: featuredProducts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get featured products',
      error,
    });
  }
});

// Get Products Filtered by Category
router.get('/filtered', async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      const categoryIds = req.query.categories
        .split(',')
        .filter((id) => mongoose.isValidObjectId(id));
      filter = { category: { $in: categoryIds } };
    }

    const productList = await Product.find(filter);
    res.json({ success: true, data: productList });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to filter products', error });
  }
});

module.exports = router;
