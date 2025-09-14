# ResumeHub - Professional Resume Platform

A comprehensive multi-user professional resume platform built with Node.js, Express.js, MongoDB, and Bootstrap 5.

## Features

### 🔐 Authentication & Security
- User registration and login with secure password hashing (bcrypt)
- Session-based authentication with MongoDB session store
- Protected routes and ownership validation
- Input validation and sanitization

### 👤 User Profile Management
- Complete profile management (name, email, phone, address, bio)
- Profile picture upload with Multer
- Social links (LinkedIn, GitHub)
- Unique username system

### 📝 Resume Sections (Full CRUD)
- **Skills**: Categorized skills with proficiency levels, displayed as badges
- **Education**: Academic qualifications with grades and descriptions
- **Projects**: Portfolio projects with technologies, GitHub/live links
- **Experience**: Work history with responsibilities and timeline display

### 🎨 Professional UI/UX
- Responsive design with Bootstrap 5
- Professional LinkedIn-inspired layout
- Interactive dashboard with statistics
- Timeline design for experience section
- Card-based layouts for all sections
- Smooth animations and transitions

### 🌐 Public Resume
- Public resume at `/resume/:username`
- Read-only view for visitors
- Professional presentation of all portfolio sections
- Responsive design for all devices

### 🔍 User Discovery
- Browse all users at `/resume/users`
- Search by name or skills
- Professional user cards with preview
- Clickable links to public profiles

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Local)
- **Template Engine**: EJS
- **Styling**: Bootstrap 5, Custom CSS
- **Authentication**: bcrypt, express-session
- **File Upload**: Multer
- **Validation**: express-validator

## Installation & Setup

1. **Clone and Navigate**
   ```bash
   cd PROJECT2
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your local machine at `mongodb://localhost:27017`

4. **Run the Application**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Access the Application**
   Open your browser and go to `http://localhost:3000`

## Project Structure

```
PROJECT2/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Skill.js             # Skills model
│   ├── Education.js         # Education model
│   ├── Project.js           # Projects model
│   └── Experience.js        # Experience model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── dashboard.js         # Dashboard routes
│   ├── portfolio.js         # Public portfolio routes
│   └── api.js               # API routes for CRUD operations
├── views/
│   ├── partials/
│   │   ├── header.ejs       # Header with navigation
│   │   └── footer.ejs       # Footer
│   ├── auth/
│   │   ├── login.ejs        # Login page
│   │   └── register.ejs     # Registration page
│   ├── dashboard/
│   │   ├── index.ejs        # Main dashboard
│   │   ├── profile.ejs      # Profile settings
│   │   └── modals.ejs       # CRUD modals
│   ├── portfolio/
│   │   ├── users.ejs        # Browse users page
│   │   └── view.ejs         # Public portfolio view
│   ├── index.ejs            # Homepage
│   └── 404.ejs              # Error page
├── public/
│   ├── css/
│   │   └── style.css        # Custom styles
│   ├── js/
│   │   └── main.js          # Frontend JavaScript
│   ├── images/              # Static images
│   └── uploads/             # User uploaded files
├── app.js                   # Main application file
└── package.json             # Dependencies and scripts
```

## Key Routes

### Authentication
- `GET /register` - Registration page
- `POST /register` - Create new user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `POST /logout` - Logout user

### Dashboard (Protected)
- `GET /dashboard` - Main dashboard
- `GET /dashboard/profile` - Profile settings
- `POST /dashboard/profile` - Update profile

### Public Portfolio
- `GET /portfolio/users` - Browse all users
- `GET /portfolio/:username` - View user portfolio

### API Endpoints (Protected)
- `POST /api/skills` - Add skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- Similar CRUD operations for education, projects, and experience

## Database Schema

### User Model
- username, fullName, email, password
- phone, address, profilePic, bio
- linkedin, github
- Timestamps

### Portfolio Models
All models reference User and include:
- **Skills**: name, category, proficiency
- **Education**: institution, degree, years, grade
- **Projects**: title, description, technologies, links
- **Experience**: company, position, dates, responsibilities

## Security Features

- Password hashing with bcrypt (12 rounds)
- Session-based authentication
- CSRF protection through session validation
- Input validation and sanitization
- File upload restrictions (images only, 5MB limit)
- Route protection middleware

## Responsive Design

- Mobile-first approach with Bootstrap 5
- Professional card-based layouts
- Responsive navigation with collapsible menu
- Optimized for all screen sizes
- Touch-friendly interface

## Future Enhancements

- PDF export functionality
- Email notifications
- Dark/light mode toggle
- Advanced search filters
- Portfolio themes
- Social sharing
- Analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.