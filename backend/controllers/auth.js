const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // Handle duplicate key error (code 11000) for unique constraints
      if (error.keyPattern) {
        if (error.keyPattern.email) 
          return res.status(400).json({ error: 'Email is already registered' });
        if (error.keyPattern.username)
          return res.status(400).json({ error: 'Username is already registered' });
      } else {
        // Handle other unique constraints if needed
        return res.status(400).json({ error: 'Duplicate key error' });
      }
    }
    next(error);
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1 hour'
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };