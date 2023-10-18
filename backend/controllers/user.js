const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, contactNumber } = req.body;

    const user = new User({ username, email, password, firstName, lastName, contactNumber });
    await user.save();
    res.json({ message: 'Registration Successful' });
    req.login(req, res, err => {
      if (err) return next(err);
    })
  } catch (err) {
    handleMongoError(err, res);
    next(err);
  }
};

// Login with an existing user
module.exports.login = async (req, res, next) => {
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

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1 hour' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// Edit an existing user
module.exports.edit = async (req, res, next) => {
  try {
    // TODO: Need check if user is logged in
    // Non-admin user can only edit their own profile
    // Admin user can edit any user profile
    // should not be able to edit username and email
    // should not expect userId in the request body
    const { userId, username, password, firstName, lastName, contactNumber } = req.body;
    const filter = { _id: userId };

    const data = { username, password, firstName, lastName, contactNumber };
    const updatedUser = User.findOneAndUpdate(filter, data, (err, res) => {
      if (err) return next(err);
      res.json({ message: 'Profile Update Successful' });
      req.login(updatedUser, err => {
        if (err) return next(err);
      })
    })

  } catch (err) {
    handleMongoError(err, res);
    next(err);
  }
};

const handleMongoError = (err, res) => {
  if (err.name === 'MongoServerError' && err.code === 11000) {
    // Handle duplicate key error (code 11000) for unique constraints
    if (err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ error: 'Email is already registered' });
    } else if (err.keyPattern && err.keyPattern.username) {
      return res.status(400).json({ error: 'Username is already registered' });
    } else {
      // Handle other unique constraints if needed
      return res.status(400).json({ error: 'Duplicate key error' });
    }
  } else if (err.name) {
    return res.status(400).json({ error: err.message });
  }
}