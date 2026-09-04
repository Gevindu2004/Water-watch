const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getMongoStatus, memoryStore } = require('../config/db');

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

    const normalizedEmail = email.trim().toLowerCase();
    let role = 'officer';
    let name = 'Nimal Jayasinghe (Water Supply Officer)';
    let userId = `user-${Date.now()}`;
    let authenticatedStoredUser = false;

    if (getMongoStatus()) {
      const storedUser = await User.findOne({ email: normalizedEmail });
      if (storedUser && storedUser.password && await storedUser.matchPassword(password)) {
        role = storedUser.role;
        name = storedUser.name;
        userId = storedUser._id.toString();
        authenticatedStoredUser = true;
      } else if (!storedUser) {
        // Continue to support the built-in demo accounts below.
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      const storedUser = memoryStore.users.find(user => user.email === normalizedEmail);
      if (storedUser && storedUser.password && await bcrypt.compare(password, storedUser.password)) {
        role = storedUser.role;
        name = storedUser.name;
        userId = storedUser._id;
        authenticatedStoredUser = true;
      } else if (storedUser && storedUser.password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    if (!authenticatedStoredUser && normalizedEmail === 'officer@test.com' && password === 'password123') {
      role = 'officer';
      name = 'Nimal Jayasinghe (Water Supply Officer)';
    } else if (!authenticatedStoredUser && normalizedEmail === 'admin@test.com' && password === 'password123') {
      role = 'admin';
      name = 'Polonnaruwa Admin Official';
    } else if (!authenticatedStoredUser && password === 'password123') {
      role = 'officer';
      name = normalizedEmail.split('@')[0].toUpperCase() + ' (Officer)';
    } else if (!authenticatedStoredUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Use officer@test.com / password123'
      });
    }

    const payload = {
      id: userId,
      email: normalizedEmail,
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

const registerOfficer = async (req, res, next) => {
  try {
    const { name, email, password, district } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name?.trim() || !normalizedEmail || !password || !district?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and district are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 6 characters'
      });
    }

    if (getMongoStatus()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'officer',
        district: district.trim()
      });

      return res.status(201).json({
        success: true,
        message: 'Officer registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          district: user.district
        }
      });
    }

    if (memoryStore.users.some(user => user.email === normalizedEmail)) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = {
      _id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: 'officer',
      district: district.trim(),
      village: '—',
      status: 'Active'
    };
    memoryStore.users.push(user);

    return res.status(201).json({
      success: true,
      message: 'Officer registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district
      }
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

module.exports = { login, getMe, registerOfficer };
