const express = require('express');
const bcrypt = require('bcryptjs');
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

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
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
  } catch (errot) {
    res.status(500).json({
      success: false,
      message: 'Server error during user creation',
      error,
    });
  }
});

module.exports = router;
