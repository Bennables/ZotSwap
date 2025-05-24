const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: 'User already exists' });

    const user = new User({ email, password }); 
    await user.save();

    res.status(201).json({ message: 'User created', email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
