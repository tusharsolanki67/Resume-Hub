const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumehub-profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Dashboard home
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const [skills, education, projects, experience] = await Promise.all([
      Skill.find({ user: userId }),
      Education.find({ user: userId }).sort({ startYear: -1 }),
      Project.find({ user: userId }).sort({ createdAt: -1 }),
      Experience.find({ user: userId }).sort({ startDate: -1 })
    ]);

    res.render('dashboard/index', {
      user: req.session.user,
      skills,
      education,
      projects,
      experience
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Profile management
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('dashboard/profile', { user, errors: null });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.post('/profile', requireAuth, upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.session.user.id;
    // Only allow specific fields to prevent mass assignment
    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      bio: req.body.bio,
      linkedin: req.body.linkedin,
      github: req.body.github
    };
    
    if (req.file) {
      updateData.profilePic = req.file.path; // Cloudinary URL
    }

    await User.findByIdAndUpdate(userId, updateData);
    
    // Update session data
    const updatedUser = await User.findById(userId);
    req.session.user.fullName = updatedUser.fullName;
    
    res.redirect('/dashboard/profile');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Delete account page
router.get('/delete-account', requireAuth, (req, res) => {
  res.render('dashboard/delete-account', { user: req.session.user });
});

// Delete account
router.post('/delete-account', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    
    if (!user) {
      return res.json({ success: false, error: 'User not found' });
    }
    
    // Delete all user data
    await Promise.all([
      User.findByIdAndDelete(user._id),
      Skill.deleteMany({ user: user._id }),
      Education.deleteMany({ user: user._id }),
      Project.deleteMany({ user: user._id }),
      Experience.deleteMany({ user: user._id })
    ]);
    
    // Destroy session and redirect
    req.session.destroy((err) => {
      if (err) {
        return res.json({ success: false, error: 'Session error' });
      }
      res.json({ success: true });
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;