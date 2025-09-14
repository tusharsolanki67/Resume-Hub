const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { requireGuest, requireAuth } = require('../middleware/auth');
const router = express.Router();

// Register page
router.get('/register', requireGuest, (req, res) => {
  res.render('auth/register', { errors: null, user: null });
});

// Register user
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/register', { errors: errors.array() });
    }

    const { username, fullName, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.render('auth/register', { 
        errors: [{ msg: 'User with this email or username already exists' }],
        user: null
      });
    }

    // Create user
    const user = new User({ username, fullName, email, password });
    await user.save();
    console.log('✅ User saved:', user.username);

    // Redirect to login page after successful registration
    res.render('auth/login', { 
      errors: null, 
      user: null,
      success: 'Registration successful! Please login with your credentials.' 
    });
  } catch (error) {
    res.render('auth/register', { 
      errors: [{ msg: 'Registration failed. Please try again.' }],
      user: null
    });
  }
});

// Login page
router.get('/login', requireGuest, (req, res) => {
  res.render('auth/login', { errors: null, user: null, success: null });
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { 
        errors: [{ msg: 'Invalid email or password' }],
        user: null,
        success: null
      });
    }

    // Create session and redirect to dashboard
    req.session.user = {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email
    };

    res.redirect('/dashboard');
  } catch (error) {
    res.render('auth/login', { 
      errors: [{ msg: 'Login failed. Please try again.' }],
      user: null,
      success: null
    });
  }
});

// Logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.redirect('/');
  });
});

module.exports = router;