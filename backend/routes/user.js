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
        UserController.register(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Register User Error: ${err}` });
      }
    }
  );

router
  .route("/login")
  .post(checkRequiredAttributes(["email", "password"]), async (req, res) => {
    try {
      UserController.login(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Login User Error: ${err}` });
    }
  });

router
  .route("/sendOTP")
  .post(checkRequiredAttributes(["email"]), async (req, res) => {
    try {
      UserController.sendOTP(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Failed to send OTP: ${err}` });
    }
  });

router
  .route("/edit")
  // TODO: add checkRequiredAttributes middleware
  .post(async (req, res) => {
    try {
      UserController.edit(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Edit User Error: ${err}` });
    }
  });

const errorHandler = (err) => {
  // console.error(err)
};

module.exports = router;
