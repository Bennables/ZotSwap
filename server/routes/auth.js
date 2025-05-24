const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/userModel');

/**
 * Generates a JWT token for the user
 * @param {*} user - The user object containing user details
 * @returns {string} - The signed JWT token
 */
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Route to handle user signup
 * @param {Object} req - The request object containing user details
 * @param {Object} res - The response object to send the result
 */
router.post('/signup', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Validate input
    if (!username || !password || (!email && !phone))
      return res.status(400).json({ error: 'Username, email or phone and password are required' });

    // Validate username, email, and phone
    const existingUser = await User.findOne({
      $or: [{username}, {email}, {phone}],
    });

    // Check if a user with the same username, email, or phone already exists
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create a new user instance
    const user = new User({ username, email, phone });
    user.passwordHash = await user.setPassword(password, 10); 
    await user.save();

    // Generate a token for the new user
    res.json({ token: signToken(user._id), user: { id: user._id, username } });
    } catch (err) {
      next(err);
    }
});

/**
 * Route to handle user login
 * @param {Object} req - The request object containing user credentials
 * @param {Object} res - The response object to send the result
 * @param {Function} next - The next middleware function
 */
router.post('/login', async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    // Find user by username, email, or phone
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phone: identifier }
      ]
    });

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password is set
    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Password not set' });
    }

    // Generate a token for the user
    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
