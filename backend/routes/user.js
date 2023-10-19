const express = require('express');
const { authenticate } = require('../middlewares/user');
const UserController = require('../controllers/user')

const router = express.Router();

router.route('/profile')
  .get(authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.user.email}` });
  });

router.route('/register')
  .post(async (req, res) => {
    try {
      UserController.register(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Register User Error: ${err}` })
    }
  })

router.route('/login')
  .post(async (req, res) => {
    try {
      UserController.login(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Login User Error: ${err}` })
    }
  })

router.route('/sendOTP')
  .post(async (req, res) => {
    try {
      UserController.sendOTP(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Failed to send OTP: ${err}` })
    }
  })

router.route('/edit')
  .post(async (req, res) => {
    try {
      UserController.edit(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Edit User Error: ${err}` })
    }
  })

const errorHandler = err => {
  // console.error(err)
}

module.exports = router;