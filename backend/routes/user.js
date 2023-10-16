const express = require('express');
const { authenticate } = require('../middlewares/auth');
const User = require('../controllers/User')

const router = express.Router();

router.route('/profile')
  .get(authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
  });

router.route('/register')
  .get((req, res) => {
    res.render('users/register');
  })
  .post(async (req, res) => {
    try {
      User.register(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Register User Error: ${err}` })
      res.redirect('/register');
    }
  })

router.route('/edit')
  .get((req, res) => {
    res.render('users/edit');
  })
  .post(async (req, res) => {
    try {
      User.edit(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Edit User Error: ${err}` })
      res.redirect('/register');
    }
  })

const errorHandler = err => {
  console.error(err)
}

module.exports = router;