<<<<<<< HEAD
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const OtpPairs = require("../models/Otp");
const { generateOTP, sendOTP } = require("../utils/otp");
=======
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OtpPairs = require('../models/Otp');
const { generateOTP, sendOTP } = require('../utils/otp');
const { errorHandler } = require('../utils/errorHandler');
>>>>>>> 54c478cafe2a9203e505088fe0bcb76931ce1ed0

// Register a new user
module.exports.register = async (req, res, next) => {
  const { email, password, firstName, lastName, contactNumber, OTP } = req.body;

  try {
    const otpPair = await OtpPairs.findOne({ email });
    const numExistingUsers = await User.countDocuments({ email });
    if (numExistingUsers > 0) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    if (!otpPair) {
      return res.status(404).json({ message: "User has not been sent OTP" });
    }

    if (otpPair.isBlocked) {
      const currentTime = new Date();
      if (currentTime < otpPair.blockUntil) {
        return res
          .status(403)
          .json({ message: "User blocked. Try after some time again." });
      } else {
        otpPair.isBlocked = false;
        otpPair.OTPAttempts = 0;
      }
    }

    if (otpPair.OTP !== OTP) {
      otpPair.OTPAttempts++;

      // Block user for 1 hour after 4 failed attempts
      if (otpPair.OTPAttempts >= 4) {
        otpPair.isBlocked = true;
        let blockUntil = new Date();
        blockUntil.setHours(blockUntil.getHours() + 1);
        otpPair.blockUntil = blockUntil;
      }

      await otpPair.save();

      return res.status(403).json({ message: "Invalid OTP" });
    }

    const OTPCreatedTime = otpPair.OTPCreatedTime;
    const currentTime = new Date();

    // OTP expires after 30 minutes
    if (currentTime - OTPCreatedTime > 30 * 60 * 1000) {
      return res.status(403).json({ message: "OTP expired" });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      contactNumber,
    });
    await user.save();
<<<<<<< HEAD
    res.json({ message: "Registration Successful" });
=======
    res.status(200).json({ message: 'Registration Successful' });
>>>>>>> 54c478cafe2a9203e505088fe0bcb76931ce1ed0
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};

// Login with an existing user
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

<<<<<<< HEAD
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });
    res.json({ token });
=======
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1 hour' });
    res.status(200).json({ token });
>>>>>>> 54c478cafe2a9203e505088fe0bcb76931ce1ed0
  } catch (error) {
    next(error);
  }
};

// Edit an existing user
module.exports.edit = async (req, res, next) => {
  try {
<<<<<<< HEAD
    // TODO: Need to check if user is logged in
    // Non-admin user can only edit their own profile
    // Admin user can edit any user profile
    // should not be able to edit username and email
    // should not expect userId in the request body
    const { userId, password, firstName, lastName, contactNumber } = req.body;
    const filter = { _id: userId };

    const data = { password, firstName, lastName, contactNumber };
    const updatedUser = User.findOneAndUpdate(filter, data, (err, res) => {
      if (err) return next(err);
      res.json({ message: "Profile Update Successful" });
      req.login(updatedUser, (err) => {
        if (err) return next(err);
      });
    });
=======
    const { email, password, firstName, lastName, contactNumber } = req.body;

    const user = req.user;
    if (!user.isAdmin && email !== user.email) {
      throw new Error('Email does not match user!');
    }

    user.password = password || user.password;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.contactNumber = contactNumber || user.contactNumber;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
>>>>>>> 54c478cafe2a9203e505088fe0bcb76931ce1ed0
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};

// generates and sends the OTP to the user
module.exports.sendOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    const numExistingUsers = await User.countDocuments({ email });
    if (numExistingUsers > 0) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    let otpPair = await OtpPairs.findOne({ email });
    if (!otpPair) {
      otpPair = new OtpPairs({ email });
    }

    if (otpPair.isBlocked) {
      const currentTime = new Date();
      if (currentTime < otpPair.blockUntil) {
        return res
          .status(403)
          .json({ message: "Account blocked. Try after some time." });
      } else {
        otpPair.isBlocked = false;
        otpPair.OTPAttempts = 0;
      }
    }

    // Check for minimum 1-minute gap between OTP requests
    const lastOTPTime = otpPair.OTPCreatedTime;
    const currentTime = new Date();

    if (lastOTPTime && currentTime - lastOTPTime < 60000) {
      return res.status(403).json({
        message: "Minimum 1-minute gap required between OTP requests",
      });
    }

    const OTP = generateOTP();
    otpPair.OTP = OTP;
    otpPair.OTPCreatedTime = currentTime;

    otpPair.save();

    sendOTP(email, OTP).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Failed to send OTP" });
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};
<<<<<<< HEAD

const handleMongoError = (err, res) => {
  if (err.name === "MongoServerError" && err.code === 11000) {
    // Handle duplicate key error (code 11000) for unique constraints
    if (err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ error: "Email is already registered" });
    } else {
      // Handle other unique constraints if needed
      return res.status(400).json({ error: "Duplicate key error" });
    }
  } else if (err.name) {
    return res.status(400).json({ error: err.message });
  }
};
=======
>>>>>>> 54c478cafe2a9203e505088fe0bcb76931ce1ed0
