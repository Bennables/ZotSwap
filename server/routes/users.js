const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// User Schema - defines the structure of user profiles
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true
  },
  talents: {
    type: String,
    default: ''
  },
  skillsWanted: {
    type: String,
    default: ''
  },
  skillsOffered: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent re-compilation issues
const User = mongoose.models.User || mongoose.model('User', userSchema);

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
          talents: "Web Development, Guitar",
          skillsWanted: "Machine Learning, Data Science",
          skillsOffered: "React, Node.js, JavaScript"
        },
        {
          name: "Sarah Kim",
          location: "Los Angeles, CA", 
          year: "Senior",
          talents: "Photography, Design",
          skillsWanted: "Business Strategy, Marketing",
          skillsOffered: "UI/UX Design, Adobe Creative Suite"
        },
        {
          name: "Mike Chen",
          location: "Seattle, WA",
          year: "Sophomore",
          talents: "Piano, Math Tutoring",
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
router.post('/', async (req, res) => {
  try {
    const { name, location, year, talents, skillsWanted, skillsOffered } = req.body;
    
    // Validation
    if (!name || !location || !year) {
      return res.status(400).json({ 
        error: 'Name, location, and year are required fields' 
      });
    }
    
    const newUser = new User({
      name: name.trim(),
      location: location.trim(),
      year: year.trim(),
      talents: talents || '',
      skillsWanted: skillsWanted || '',
      skillsOffered: skillsOffered || ''
    });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

// GET /api/users/:id - Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
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
