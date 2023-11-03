
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports.checkRequiredAttributes = (requiredAttributes) => {
  return (req, res, next) => {
    const requestBody = req.body;
    const missingAttributes = requiredAttributes.filter(attr => !(attr in requestBody));
    
    if (missingAttributes.length > 0) {
      return res.status(400).json({ message: `Missing required attribute(s) in request body: ${missingAttributes.join(', ')}` });
    }
    
    next();
  };
};