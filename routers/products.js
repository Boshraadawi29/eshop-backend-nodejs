const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const mongoose = require("mongoose");

router.post(`/newproduct`, async (req, res) => {
  category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
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

router.get(`/`, async (req, res) => {
  const { id } = req.body;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(500).json({
      success: false,
      error: "Product ID is not exist",
    });
  }
  res.send(product);
});

router.get(`/productlist`, async (req, res) => {
  //this will not work bacause it is trying to return the res befor the find finished
  // const productList = Product.find();
  // res.send(productList);
  const productList = await Product.find();
  if (!productList) {
    return res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

router.get(`/productnames`, async (req, res) => {
  const productList = await Product.find().select("name description -_id");
  if (!productList) {
    return res.status(500).json({
      success: false,
    });
  }

  res.send(productList);
});

router.get(`/productwithcategory`, async (req, res) => {
  const { id } = req.body;
  const product = await Product.findById(id).populate("category");
  if (!product) {
    return res.status(500).json({
      success: false,
    });
  }

  res.send(product);
});

router.put(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  const { id } = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedProduct) {
    return res.status(500).json({
      success: false,
      message: "Product can not be updated",
    });
  }

  res.send(updatedProduct);
});

router.delete(`/`, async (req, res) => {
  const { id } = req.body;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid ID");
  }
  const deletedProduct = await Product.findOneAndDelete({ _id: id });
  if (!deletedProduct) {
    return res.status(404).send("Product not find");
  }
  res.status(200).json({
    result: deletedProduct,
  });
});

router.get(`/count`, async (req, res) => {
  //I am here
  const productCount = await Product.countDocuments();
  if (!productCount) {
    return res.status(500).json({
      success: false,
    });
  }
  res.status(200).json({ success: true, count: productCount });
});

router.get(`/featured`, async (req, res) => {
  const featuredProducts = await Product.find({ isFeatured: true });

  if (featuredProducts.length === 0) {
    return res.status(404).json({ success: false });
  }

  res.status(200).send(featuredProducts)
});

module.exports = router;
