const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OtpPairs = require('../models/Otp');
const { generateOTP, sendOTP } = require('../utils/otp');
const { errorHandler } = require('../utils/errorHandler');

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
    res.status(200).json({ message: "Registration Successful" });
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

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

// Edit an existing user
module.exports.edit = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, contactNumber } = req.body;

    const user = req.user;
    if (!user.isAdmin && email !== user.email) {
      throw new Error("Email does not match user!");
    }

    user.password = password || user.password;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.contactNumber = contactNumber || user.contactNumber;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
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
