const errorHandler = (err, res) => {
  if (err.name === 'MongoServerError' && err.code === 11000) {
    // Handle duplicate key error (code 11000) for unique constraints
    if (err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ error: 'Email is already registered' });
    } else {
      // Handle other unique constraints if needed
      return res.status(400).json({ error: 'Duplicate key error' });
    }
  } else if (err.name) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { errorHandler };