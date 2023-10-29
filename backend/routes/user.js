const express = require("express");
const {
  authenticate,
  checkRequiredAttributes,
} = require("../middlewares/user");
const UserController = require("../controllers/user");

const router = express.Router();

router.route("/testLogin").get(authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}` });
});

router
  .route("/register")
  .post(
    checkRequiredAttributes([
      "email",
      "OTP",
      "password",
      "firstName",
      "lastName",
    ]),
    async (req, res) => {
      try {
        await UserController.register(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Register User Error: ${err}` });
      }
    }
  );

router.route('/login')
  .post(checkRequiredAttributes(["email", "password"]),
    async (req, res) => {
      try {
        await UserController.login(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Login User Error: ${err}` })
      }
    })

router.route('/sendOTP')
  .post(checkRequiredAttributes(["email"]),
    async (req, res) => {
      try {
        await UserController.sendOTP(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Failed to send OTP: ${err}` })
      }
    })

router
  .route("/edit")
  // TODO: add checkRequiredAttributes middleware
  .post(authenticate,
    checkRequiredAttributes(["email"]),
    async (req, res) => {
    try {
      await UserController.edit(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Edit User Error: ${err}` });
    }
  });

const errorHandler = (err) => {}

module.exports = router;
