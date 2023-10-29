const { v4: uuidv4 } = require('uuid');
const { LostItem, FoundItem, PotentialMatch } = require('../models/Item');
const { s3 } = require('../utils/aws');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { errorHandler } = require('../utils/errorHandler');


// Register a new user
module.exports.createLostRequest = async (req, res, next) => {
  const { type, brand, size, colour, locationLost, description } = req.body;
  let imageUrls = [];

  try {
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToS3('lost-items', file));
      imageUrls = await Promise.all(uploadPromises);
    }

    const lostItem = new LostItem({
      type,
      brand,
      size,
      colour,
      locationLost,
      imageUrls,
      host: req.user._id,
      description
    });

    // Save to database
    await lostItem.save();

    res.status(200).json({ message: 'Uploaded file', urlLocations: imageUrls });
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};


async function uploadToS3(folder, file) {
  const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  });

  try {
    await s3.send(command);
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${encodeURIComponent(fileName)}`;
  } catch (error) {
    console.error('An error occurred while uploading the file:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
