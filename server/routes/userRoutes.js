const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error code
        return res.status(400).json({ error: 'Username already exists' });
      }
      
      // Generic error response for other issues
      res.status(500).json({ error: 'User creation failed' });
    }
});

module.exports = router;
