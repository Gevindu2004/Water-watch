const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// @desc    Officer / Admin Login
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let role = 'officer';
    let name = 'Nimal Jayasinghe (Water Supply Officer)';

    if (email.toLowerCase() === 'officer@test.com' && password === 'password123') {
      role = 'officer';
      name = 'Nimal Jayasinghe (Water Supply Officer)';
    } else if (email.toLowerCase() === 'admin@test.com' && password === 'password123') {
      role = 'admin';
      name = 'Polonnaruwa Admin Official';
    } else if (password === 'password123') {
      role = 'officer';
      name = email.split('@')[0].toUpperCase() + ' (Officer)';
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Use officer@test.com / password123'
      });
    }

    const payload = {
      id: 'user-' + Date.now(),
      email: email.toLowerCase(),
      name,
      role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: payload
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

module.exports = { login, getMe };
