const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// At the top of your route file
const multer = require('multer');
const upload = multer(); // memory storage by default

// Import the User model
const User = require('../models/userModel');

// GET /api/users - Fetch all user profiles
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    
    // If no users exist, return sample data for testing
    if (users.length === 0) {
      const sampleUsers = [
        {
          name: "Alex Johnson",
          location: "San Francisco, CA",
          year: "Junior",
          skillsWanted: "Machine Learning, Data Science",
          skillsOffered: "React, Node.js, JavaScript"
        },
        {
          name: "Sarah Kim",
          location: "Los Angeles, CA", 
          year: "Senior",
          skillsWanted: "Business Strategy, Marketing",
          skillsOffered: "UI/UX Design, Adobe Creative Suite"
        },
        {
          name: "Mike Chen",
          location: "Seattle, WA",
          year: "Sophomore",
          skillsWanted: "Programming, Web Design",
          skillsOffered: "Calculus Help, Music Theory"
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
 uploading
    const { name, location, year, talents } = req.body;
    let skillsWanted = JSON.parse(req.body.skillsWanted || '[]');
    skillsWanted= skillsWanted.join(', '); 
    let skillsOffered = JSON.parse(req.body.skillsOffered || '[]');
    skillsOffered= skillsOffered.join(', ');  
    
    

    if (!name || !location || !year) {
      return res.status(400).json({ error: 'Name, location, and year are required fields' });
    }

    const { 
      firstName,
      lastName,
      age,
      location,
      year,
      talents,
      skillsWanted, // Should be an array
      skillsOffered, // Should be an array
      instagram,
      snapchat,
      tiktok,
      discord,
      twitter,
      phone, // Assuming phone is part of signup form now
      email, // Assuming email is part of signup form now
      password // <-- Add password here
    } = req.body;
    
    // Validation
    if (!firstName || !lastName || !age || !location || !year || !email) {
      return res.status(400).json({ 
        error: 'First name, last name, age, location, year, and email are required fields' 
      });
    }
    
    // Combine first and last name for the 'name' field (if you still need it, otherwise remove 'name' from model/schema)
    // Assuming 'name' is no longer needed based on model update, using firstName and lastName instead.
 main

    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: age,
      location: location.trim(),
      year: year.trim(),
      talents: talents || '',
 uploading
      skillsWanted:skillsWanted, // Convert back to string
      skillsOffered: skillsOffered, // Convert back to string

      skillsWanted: skillsWanted || [], // Ensure it's an array
      skillsOffered: skillsOffered || [], // Ensure it's an array
      instagram: instagram || '',
      snapchat: snapchat || '',
      tiktok: tiktok || '',
      discord: discord || '',
      twitter: twitter || '',
      phone: phone || '',
      email: email.trim(),
      password: password // <-- Add password here
 main
    });
    
    // We should hash the password before saving
    await newUser.setPassword(password);

    const savedUser = await newUser.save();
    // Do not send password back in response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    // Check for duplicate key error (e.g., email unique constraint)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email or phone number already exists' });
    }
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

 uploading

// GET /api/users/me - Fetch the currently authenticated user's profile using email in header
router.get('/me', async (req, res) => {
  // Use email from a custom header for authentication (simplified)
  const userEmail = req.headers['x-user-email']; // Read email from X-User-Email header

  if (!userEmail) {
    return res.status(401).json({ error: 'Unauthorized: Email header missing' });
  }

  try {
    const user = await User.findOne({ email: userEmail }); // Find user by email
    
    if (!user) {
      return res.status(404).json({ error: 'User not found with provided email' });
    }
    
    // Return the user profile data
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile by email:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});
 main

// GET /api/users/:id - Get a specific user by ID
// NOTE: This route might be redundant if /me is used for the current user
// but keeping it in case fetching other users by ID is needed.
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Fetch user by ID from URL parameter
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return the user profile data
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// GET /api/users/:id - Get a specific user by ID
router.get('/email/:email/matches', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate('matches');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user.matches);
  } catch (err) {
    next(err);
  }
});


// Like a user
router.post('/like', async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    // Add to likesSent and likesReceived
    if (!sender.likesSent.includes(receiverId)) {
      sender.likesSent.push(receiverId);
      receiver.likesReceived.push(senderId);
    }

    // If receiver already liked sender → it's a match!
    if (receiver.likesSent.includes(senderId)) {
      sender.matches.push(receiverId);
      receiver.matches.push(senderId);
    }

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Like processed' });
  } catch (err) {
    res.status(500).json({ error: 'Error processing like' });
  }
});


// PUT /api/users/:id - Update a user profile
router.put('/:id', async (req, res) => {
  try {
    const { name, location, year, talents, skillsWanted, skillsOffered } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        location: location?.trim(),
        year: year?.trim(),
        talents: talents || '',
        skillsWanted: skillsWanted || '',
        skillsOffered: skillsOffered || ''
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// DELETE /api/users/:id - Delete a user profile
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user profile' });
  }
});

module.exports = router;
