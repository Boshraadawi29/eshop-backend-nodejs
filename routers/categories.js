const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({
      success: false,
    });
  }

  res.status(200).json({ success: true, data: categoryList });
});

router.post(`/`, async (req, res) => {
  const new_category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  new_category
    .save()
    .then((createdCategory) => {
      res.status(200).json({ createdCategory });
    })
    .catch((err) => {
      success: false;
    });
});

router.delete(`/`, (req, res) => {
  const { id } = req.body;
  // Category.findByIdAndDele
  Category.findOneAndDelete(id)
    .then(
      res.status(200).json({
        success: true
      })
    )
    .catch((err) =>
      res.status(500).json({
        success: false,
        "error": err
      }),
    );
});

module.exports = router;
