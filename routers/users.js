require('dotenv/config');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();
const { User } = require('../models/user');

router.post(`/register`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) {
    return res.status(500).json({
      success: false,
      message: 'User cannot be created',
    });
  }

  res.status(200).json(user);
});

//check if isAdmin
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

router.get(`/:id`, async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }
  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.get(`/`, async (req, res) => {
  try {
    const userList = await User.find().select('-password');

    if (!userList) {
      return res.status(404).json({
        success: false,
        message: 'Can not get user list',
      });
    }
    res.status(200).json({
      success: true,
      date: userList,
    });
  } catch (error) {
    res.status(500).json({
      success: fales,
      message: 'Server error',
    });
  }
});

router.post(`/login`, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User is not found!',
    });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (isMatch) {
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    res.status(200).json({
      data: token,
    });
  } else {
    res.status(400).json({
      message: 'Incorrect password',
    });
  }
});
module.exports = router;
