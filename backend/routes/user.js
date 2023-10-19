const express = require('express');
const { authenticate } = require('../middlewares/auth');
const UserController = require('../controllers/user')

const router = express.Router();

router.route('/profile')
  .get(authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
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

router.route('/edit')
  .post(async (req, res) => {
    try {
      UserController.edit(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Edit User Error: ${err}` })
    }
  })

const errorHandler = err => {
  console.error(err)
}

module.exports = router;