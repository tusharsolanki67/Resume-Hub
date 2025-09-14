const express = require('express');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const router = express.Router();

// Browse all users
router.get('/users', async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('username fullName profilePic bio')
      .limit(20);

    // Get skills for search functionality
    let skillsMatch = [];
    if (search) {
      const skills = await Skill.find({ 
        name: { $regex: search, $options: 'i' } 
      }).populate('user', 'username fullName profilePic bio');
      
      skillsMatch = skills.map(skill => skill.user).filter(user => user);
    }

    // Combine and deduplicate results
    const allUsers = [...users];
    skillsMatch.forEach(skillUser => {
      if (!allUsers.find(user => user._id.toString() === skillUser._id.toString())) {
        allUsers.push(skillUser);
      }
    });

    res.render('portfolio/users', { 
      users: allUsers, 
      search,
      user: req.session.user 
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Public portfolio view
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password');
    
    if (!user) {
      return res.status(404).render('404', { user: req.session.user || null });
    }

    const [skills, education, projects, experience] = await Promise.all([
      Skill.find({ user: user._id }),
      Education.find({ user: user._id }).sort({ startYear: -1 }),
      Project.find({ user: user._id }).sort({ createdAt: -1 }),
      Experience.find({ user: user._id }).sort({ startDate: -1 })
    ]);

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.render('portfolio/view', {
      portfolioUser: user,
      skills: skillsByCategory,
      education,
      projects,
      experience,
      user: req.session.user,
      isOwner: req.session.user && req.session.user.id === user._id.toString()
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;