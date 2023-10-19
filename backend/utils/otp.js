const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateOTP = () => {
  return crypto.randomBytes(3).toString("hex");
};

const sendOTP = (email, OTP) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SERVICE_USER,
    to: email,
    subject: "Findify: Account verification OTP",
    text: `Your OTP is: ${OTP}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTP };