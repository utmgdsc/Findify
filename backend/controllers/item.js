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
      const file = req.file;
      const fileName = `lost-items/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      try {
        await s3.send(command);
        imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${encodeURIComponent(fileName)}`;
      } catch (error) {
        console.error('An error occurred while uploading the file:', error);
        // Handle specific S3 errors or general AWS errors
        if (error.code === 'AccessDenied') {
          return res.status(403).json({ message: 'Access Denied to S3 bucket.' });
        } else if (error.code === 'NoSuchBucket') {
          return res.status(400).json({ message: 'S3 Bucket does not exist.' });
        } else {
          return res.status(500).json({ message: 'Failed to upload image.' });
        }
      }
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
