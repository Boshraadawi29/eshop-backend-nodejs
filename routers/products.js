const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");

//this is how we response to the front-end when he ask us "GET json data"
router.get(`/`, (req, res) => {
  const json = {
    id: 1,
    name: "BOSHRA",
    image: "some_url",
  };
  res.send(json);
});

router.post(`/newproduct`, (req, res) => {
  // const new_product = req.body;
  // console.log(new_product)
  const new_product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  //promise, save function is asynch, then means if it success, chatch means if any error
  new_product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });

  res.send(new_product);
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

module.exports = router;
