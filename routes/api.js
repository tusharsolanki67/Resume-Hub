const express = require('express');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Skills CRUD
router.post('/skills', requireAuth, async (req, res) => {
  try {
    const skill = new Skill({
      name: req.body.name,
      category: req.body.category,
      proficiency: req.body.proficiency,
      user: req.session.user.id
    });
    await skill.save();
    res.json({ success: true, skill });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/skills/:id', requireAuth, async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      proficiency: req.body.proficiency
    };
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      updateData,
      { new: true }
    );
    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    res.json({ success: true, skill });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/skills/:id', requireAuth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user.id
    });
    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Education CRUD
router.post('/education', requireAuth, async (req, res) => {
  try {
    const education = new Education({
      institution: req.body.institution,
      degree: req.body.degree,
      fieldOfStudy: req.body.fieldOfStudy,
      startYear: req.body.startYear,
      endYear: req.body.endYear,
      grade: req.body.grade,
      description: req.body.description,
      user: req.session.user.id
    });
    await education.save();
    res.json({ success: true, education });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/education/:id', requireAuth, async (req, res) => {
  try {
    const updateData = {
      institution: req.body.institution,
      degree: req.body.degree,
      fieldOfStudy: req.body.fieldOfStudy,
      startYear: req.body.startYear,
      endYear: req.body.endYear,
      grade: req.body.grade,
      description: req.body.description
    };
    const education = await Education.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      updateData,
      { new: true }
    );
    if (!education) {
      return res.status(404).json({ success: false, error: 'Education not found' });
    }
    res.json({ success: true, education });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/education/:id', requireAuth, async (req, res) => {
  try {
    const education = await Education.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user.id
    });
    if (!education) {
      return res.status(404).json({ success: false, error: 'Education not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Projects CRUD
router.post('/projects', requireAuth, async (req, res) => {
  try {
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies ? req.body.technologies.split(',').map(t => t.trim()) : [],
      githubUrl: req.body.githubUrl,
      liveUrl: req.body.liveUrl,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      user: req.session.user.id
    });
    await project.save();
    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/projects/:id', requireAuth, async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies ? req.body.technologies.split(',').map(t => t.trim()) : [],
      githubUrl: req.body.githubUrl,
      liveUrl: req.body.liveUrl,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    };
    
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      updateData,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/projects/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user.id
    });
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Experience CRUD
router.post('/experience', requireAuth, async (req, res) => {
  try {
    const experience = new Experience({
      company: req.body.company,
      position: req.body.position,
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      current: req.body.current === 'on' || req.body.current === true,
      description: req.body.description,
      responsibilities: req.body.responsibilities ? req.body.responsibilities.split('\n').filter(r => r.trim()) : [],
      user: req.session.user.id
    });
    await experience.save();
    res.json({ success: true, experience });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/experience/:id', requireAuth, async (req, res) => {
  try {
    const updateData = {
      company: req.body.company,
      position: req.body.position,
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      current: req.body.current === 'on' || req.body.current === true,
      description: req.body.description,
      responsibilities: req.body.responsibilities ? req.body.responsibilities.split('\n').filter(r => r.trim()) : []
    };
    
    const experience = await Experience.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      updateData,
      { new: true }
    );
    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }
    res.json({ success: true, experience });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/experience/:id', requireAuth, async (req, res) => {
  try {
    const experience = await Experience.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user.id
    });
    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;