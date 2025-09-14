// Load environment variables
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Production security check
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  console.error('❌ SESSION_SECRET environment variable is required in production!');
  process.exit(1);
}

// Database connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_platform')
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1);
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 500 : 2000, // More reasonable limits
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'resume_platform_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_platform'
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false, // Allow HTTP for now
    httpOnly: true, // Prevent XSS
    sameSite: 'lax' // Less strict for deployment
  },
  name: 'resume.sid' // Custom session name
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/resume', require('./routes/portfolio'));
app.use('/api', require('./routes/api'));

// Home route
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { user: req.session.user || null });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const user = req.session && req.session.user ? req.session.user : null;
  res.status(500).render('404', { user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📱 Visit: http://localhost:${PORT}`);
  }
});