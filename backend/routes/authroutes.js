const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/userSchema');
const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /signup - Register a new user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Received signup request:', req.body);

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    console.log('User created successfully:', user);
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /login - User login or Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', req.body);

  try {
    // Admin login attempt
    const admin = await Admin.findOne({ email });
    if (admin) {
      console.log('Admin found:', admin.email);

      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const payload = { user: { id: admin.id, role: 'admin' } };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) {
            console.error('Error signing JWT:', err);
            return res.status(500).json({ message: 'Token generation error' });
          }
          console.log('JWT generated for admin');
          return res.json({ token, role: 'admin' });
        });
      } else {
        console.log('Invalid credentials: password mismatch for admin');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    // Regular user login attempt
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials: user not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials: password mismatch for user');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: 'user' } };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('Error signing JWT:', err);
        return res.status(500).json({ message: 'Token generation error' });
      }
      console.log('JWT generated for user');
      return res.json({ token, role: 'user' });
    });
  } catch (error) {
    console.error('Error during login:', error);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
});

module.exports = router;
