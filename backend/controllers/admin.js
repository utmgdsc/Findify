const { LostItem, FoundItem, PotentialMatch } = require('../models/Item');
const User = require('../models/User');
const { getTransporter } = require('../utils/otp');

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
    // send the email to this admin (ramdomly chosen)
    const lostAndFoundAdmin = await User.findOne({ isAdmin: true });
    if (!lostAndFoundAdmin) {
      throw new Error('Lost and Found Admin not found');
    }
    
    const transporter = getTransporter();
    
    const mailOptions = {
      from: `Findify <${process.env.EMAIL_SERVICE_USER}>`,
      to: lostAndFoundAdmin.email,
      subject: "Findify: New user inquiry received",
      text: `You have a new inquiry from the user: ${req.user.email}
      subject: ${req.body.subject}
      body: ${req.body.body}`,
    };

    transporter.sendMail(mailOptions).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Failed to email the admin" });
    });

    res.status(200).json({ message: "Admin emailed successfully" });
  } catch (err) {
    console.error("Error sending email to admin:", err);
    res.status(500).json({ message: 'Error sending email to admin' });
  }
}