const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // memory storage by default

const User = require('../models/userModel');

// GET /api/users - Fetch all user profiles
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    
    // Return sample data if no users exist
    if (users.length === 0) {
      const sampleUsers = [
        {
          name: "Alex Johnson",
          location: "UCI Campus",
          year: "Junior",
          skillsWanted: ["Machine Learning", "Data Science"],
          skillsOffered: ["React", "Node.js", "JavaScript"]
        },
        {
          name: "Sarah Kim",
          location: "Irvine", 
          year: "Senior",
          skillsWanted: ["Business Strategy", "Marketing"],
          skillsOffered: ["UI/UX Design", "Adobe Creative Suite"]
        },
        {
          name: "Mike Chen",
          location: "UCI Campus",
          year: "Sophomore",
          skillsWanted: ["Programming", "Web Design"],
          skillsOffered: ["Calculus", "Music Theory"]
        }
      ];
      return res.json(sampleUsers);
    }
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch user profiles' });
  }
});

// POST /api/users - Create a new user profile
router.post('/', upload.any(), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      location,
      year,
      talents,
      instagram,
      snapchat,
      tiktok,
      discord,
      twitter,
      phone,
      email,
      password
    } = req.body;

    // Parse skills arrays from form data
    let skillsWanted = JSON.parse(req.body.skillsWanted || '[]');
    let skillsOffered = JSON.parse(req.body.skillsOffered || '[]');
    
    // Validation
    if (!firstName || !lastName || !age || !location || !year || !email) {
      return res.status(400).json({ 
        error: 'First name, last name, age, location, year, and email are required fields' 
      });
    }

    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: parseInt(age),
      location: location.trim(),
      year: year.trim(),
      talents: talents || '',
      skillsWanted,
      skillsOffered,
      socials: {
        instagram: instagram || '',
        snapchat: snapchat || '',
        tiktok: tiktok || '',
        discord: discord || '',
        twitter: twitter || ''
      },
      phone: phone || '',
      email: email.trim().toLowerCase()
    });

    // Hash password before saving
    await newUser.setPassword(password);

    const savedUser = await newUser.save();
    
    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email or phone number already exists' });
    }
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

// GET /api/users/me - Get current user's profile
router.get('/me', async (req, res) => {
  const userEmail = req.headers['x-user-email'];

  if (!userEmail) {
    return res.status(401).json({ error: 'Unauthorized: Email header missing' });
  }

  try {
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// GET /api/users/email/:email/matches - Get user's matches
router.get('/email/:email/matches', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate('matches');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user.matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// POST /api/users/like - Like a user
router.post('/like', async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  try {
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add to likes
    if (!sender.likesSent.includes(receiver._id)) {
      sender.likesSent.push(receiver._id);
      receiver.likesReceived.push(sender._id);
    }

    // Check for match
    if (receiver.likesSent.includes(sender._id)) {
      sender.matches.push(receiver._id);
      receiver.matches.push(sender._id);
    }

    await Promise.all([sender.save(), receiver.save()]);
    res.status(200).json({ message: 'Like processed successfully' });
  } catch (error) {
    console.error('Error processing like:', error);
    res.status(500).json({ error: 'Failed to process like' });
  }
});

module.exports = router;
