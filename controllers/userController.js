const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      street,
      apartment,
      zip,
      city,
      country,
      isAdmin,
    } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and phone are required.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      street,
      apartment,
      zip,
      city,
      country,
      isAdmin,
    });

    const savedUser = await newUser.save();

    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('❌ Error registering user:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Create user (admin use)
exports.createUser = async (req, res) => {
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
    return res.status(400).json({
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

    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error during user creation',
        error,
      });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const userList = await User.find().select('-password');

    if (!userList) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot get user list' });
    }

    res.status(200).json({ success: true, data: userList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'User is not found!' });
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

    res.status(200).json({ data: token });
  } else {
    res.status(400).json({ message: 'Incorrect password' });
  }
};
