const { v4: uuidv4 } = require('uuid');
const { LostItem, FoundItem, PotentialMatch } = require('../models/Item');
const { s3 } = require('../utils/aws');
const { errorHandler } = require('../utils/errorHandler');
const Fuse = require('fuse.js');
const { default: mongoose } = require('mongoose');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

module.exports.getAllLostItems = async (req, res, next) => {
  try {
    const lostItems = await LostItem.find({});
    res.json({ lostItems });
  } catch (err) {
    console.error("Error fetching all lostItems:", err);
    res.status(500).json({ message: 'Error fetching all lostItems' });
  }
}

module.exports.getAllFoundItems = async (req, res, next) => {
  try {
    const foundItems = await FoundItem.find({});
    res.json({ foundItems });
  } catch (err) {
    console.error("Error fetching all foundItems:", err);
    res.status(500).json({ message: 'Error fetching all foundItems' });
  }
}

module.exports.getAllPotentialMatches = async (req, res, next) => {
  try {
    const potentialMatches = await PotentialMatch.find({});
    res.json({ potentialMatches });
  } catch (err) {
    console.error("Error fetching all potentialMatches:", err);
    res.status(500).json({ message: 'Error fetching all potentialMatches' });
  }
}

module.exports.emailAdmin = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    })
    const mailOptions = {
      from: `Findify <${process.env.EMAIL_ADDRESS}>`,
      to: 'goutams.in@hotmail.com',
      subject: `Findify - ${req.body.subject}`,
      text: `${req.body.message}
      Thanks,
      ${req.user.email}
      `
    }
    return await transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error(err);
      else console.log('Email sent:', info.response);
    });
  } catch (err) {
    console.error("Error sending email to admin:", err);
    res.status(500).json({ message: 'Error sending email to admin' });
  }
}