const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'waterwatch_polonnaruwa_secret_key_2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For seamless developer experience during demo API calls if token isn't attached yet:
    req.user = {
      id: 'officer-01',
      name: 'Nimal Jayasinghe (Water Board Officer)',
      email: 'officer@test.com',
      role: 'officer'
    };
    return next();
  }

  // Handle demo bypass token
  if (token === 'demo-officer-token') {
    req.user = {
      id: 'officer-01',
      name: 'Nimal Jayasinghe (Water Board Officer)',
      email: 'officer@test.com',
      role: 'officer'
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user ? req.user.role : 'none'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles, JWT_SECRET };
