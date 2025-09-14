// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

// Check if user is guest (not authenticated)
const requireGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  } else {
    return next();
  }
};

// Check if user owns the resource
const checkOwnership = (req, res, next) => {
  if (req.session && req.session.user) {
    req.isOwner = req.session.user.id === req.params.userId;
    return next();
  } else {
    return res.redirect('/login');
  }
};

module.exports = {
  requireAuth,
  requireGuest,
  checkOwnership
};