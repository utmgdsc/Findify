const multer = require('multer');

const upload = multer({
  limits: { fileSize: 3 * 1024 * 1024 } // Limit of 5MB
}).array('images', 5);

function multerUpload(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Please upload a file smaller than 5 MB.' });
      }

      return res.status(500).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ message: `Error during file upload: ${err.message}` });
    }

    // If everything went fine, move to next middleware
    next();
  });
}

module.exports = multerUpload;
