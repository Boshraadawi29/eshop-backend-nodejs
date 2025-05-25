const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");

router.post(`/newproduct`, (req, res) => {
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
    isFeatured: req.body.isFeatures,
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

  // res.send(new_product);
});

router.get(`/`, async (req, res) => {
  const { id } = req.body;
  const product = await Product.findById(id);
  if (!product) {
    res.status(500).json({
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
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

router.get(`/productnames`, async (req, res) => {
  const productList = await Product.find().select("name description -_id");
  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(productList);
});

router.get(`/productwithcategory`, async (req, res) => {
  const { id } = req.body;
  const product = await Product.findById(id).populate("category");
  if (!product) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(product);
});

router.put(`/`, async (req, res) => {
  const { id } = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(id, {
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
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
  });

  if (!updatedProduct) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.send(updatedProduct);
});
module.exports = router;
