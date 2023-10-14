const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, contactNumber } = req.body;
    const user = new User({ username, email, password, firstName, lastName, contactNumber });
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
    const { userId, username, password, firstName, lastName, contactNumber } = req.body;
    const filter = { _id: userId };

    const data = { username, password, firstName, lastName, contactNumber };
    const updatedUser = User.findOneAndUpdate(filter, data, (err, res) => {
      if (err) return next(err);
      res.json({ message: 'Profile Update Successful' });
      req.login(updatedUser, err => {
        if (err) return next(err);
        // After edit profile take to homepage
        res.redirect('/home')
      })
    })

  } catch (err) {
    handleMongoError(err, res);
    next(err);
    res.redirect('/edit');
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
  }
}