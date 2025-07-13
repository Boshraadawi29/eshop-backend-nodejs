const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  createUser,
} = require('../controllers/userController');

const authJWT = require('../helpers/jwt');
const checkAdmin = require('../helpers/checkAdmin');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/', authJWT(), checkAdmin, getAllUsers);
router.post('/', authJWT(),checkAdmin, createUser);
router.get('/:id',authJWT(), checkAdmin, getUserById);


module.exports = router;

