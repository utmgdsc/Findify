const { LostItem, FoundItem, PotentialMatch } = require('../models/Item');
const { s3 } = require('../utils/aws');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { errorHandler } = require('../utils/errorHandler');

// Register a new user
module.exports.createLostRequest = async (req, res, next) => {
  const { type, brand, size, colour, locationLost, description } = req.body;
  let imageUrl = '';

  try {
    if (req.file) {
      imageUrl = await uploadToS3('lost-items', req.file);
    }

    const lostItem = new LostItem({
      type,
      brand,
      size,
      colour,
      locationLost,
      imageUrl,
      host: req.user._id,
      description
    });

    // Save to database
    await lostItem.save();

    res.status(200).json({ message: 'Uploaded file', urlLocation: imageUrl });
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};


async function uploadToS3(folder, file) {
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;
  
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
