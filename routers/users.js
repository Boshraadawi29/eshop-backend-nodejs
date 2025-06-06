const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

router.post(`/`, async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(500).json({
      success: false,
      message: 'name, email, password and phone are required fields',
    });
  }

  const user = new User({
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  });

  const savedUser = await user.save();

  if (!savedUser) {
    return res.status(500).json({
      success: false,
      message: 'Can not create user',
    });
  }

  res.status(201).json({
    success: true,
    user: savedUser,
  });
});

module.exports = router;
