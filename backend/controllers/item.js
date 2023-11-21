const { v4: uuidv4 } = require('uuid');
const { LostItem, FoundItem, PotentialMatch } = require('../models/Item');
const User = require('../models/User');
const { s3 } = require('../utils/aws');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { errorHandler } = require('../utils/errorHandler');
const Fuse = require('fuse.js');
const { default: mongoose } = require('mongoose');

module.exports.getLostRequest = async (req, res, next) => {
  try {
    const lostRequestId = req.params.id
    const lostItem = await LostItem.findById(lostRequestId);

    if (!lostItem) {
      // If lostItem does not exist, send a 404 Not Found response
      return res.status(404).json({ message: 'Lost item not found' });
    }

    res.json({ lostItem });
  } catch (err) {
    console.error("Error fetching lostItem details:", err);
    res.status(500).json({ message: 'Error fetching lostItem details' });
  }
}

module.exports.createLostRequest = async (req, res, next) => {
  const { type, brand, size, colour, locationLost, description, itemName, timeLost } = req.body;
  let imageUrls = [];

  try {
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToS3('lost-items', file));
      imageUrls = await Promise.all(uploadPromises);
    }

    const lostItem = new LostItem({
      itemName,
      type,
      brand,
      size,
      colour,
      locationLost,
      imageUrls,
      host: req.user._id,
      description,
      timeLost
    });

    // Save to database
    const item = await lostItem.save();

    res.status(200).json({ message: `Created lost item successfully ID: ${item._id}`, urlLocations: imageUrls });
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};

module.exports.editLostRequest = async (req, res, next) => {
  const { lostRequestId } = req.body;
  const user = req.user;
  const lostItem = await LostItem.findById(lostRequestId);
  let imageUrls = [];

  try {
    if (!user.isAdmin && !lostItem.host._id.equals(user._id)) {
      throw new Error('401 Unauthorized: User does not own lost request');
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToS3('found-items', file));
      imageUrls = await Promise.all(uploadPromises);
    }

    const update = {
      itemName: req.body.itemName ? req.body.itemName : lostItem.itemName,
      type: req.body.type ? req.body.type : lostItem.type,
      brand: req.body.brand ? req.body.brand : lostItem.brand,
      size: req.body.size ? req.body.size : lostItem.size,
      colour: req.body.color ? req.body.color : lostItem.colour,
      locationLost: req.body.locationLost ? req.body.locationLost : lostItem.locationLost,
      imageUrls: (imageUrls.length > 0) ? imageUrls : lostItem.imageUrls,
      description: req.body.description ? req.body.description : lostItem.description,
      timeLost: req.body.timeLost ? req.body.timeLost : lostItem.timeLost
    };

    // update in database
    await LostItem.findOneAndUpdate({ _id: lostRequestId }, update)
    res.status(200).json({ message: 'Edited lost item successfully', urlLocations: update.imageUrls });
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};

module.exports.deleteLostRequest = async (req, res, next) => {
  const lostRequestId = req.params.id;
  const user = req.user;
  const lostItem = await LostItem.findById(lostRequestId);

  try {
    if (!user.isAdmin && !lostItem.host.equals(user._id)) {
      throw new Error('401 Unauthorized: User does not own lost request')
    }
    await FoundItem.findByIdAndDelete(lostRequestId);
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
}

module.exports.getFoundRequest = async (req, res, next) => {
  try {
    const foundRequestId = req.params.id
    const foundItem = await FoundItem.findById(foundRequestId);

    if (!foundItem) {
      // If foundItem does not exist, send a 404 Not Found response
      return res.status(404).json({ message: 'Found item not found' });
    }

    res.json({ foundItem });
  } catch (err) {
    console.error("Error fetching foundItem details:", err);
    res.status(500).json({ message: 'Error fetching foundItem details' });
  }
}

module.exports.createFoundRequest = async (req, res, next) => {
  const { type, brand, size, colour, locationFound, description, itemName, timeFound } = req.body;
  let imageUrls = [];

  try {
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToS3('found-items', file));
      imageUrls = await Promise.all(uploadPromises);
    }

    const foundItem = new FoundItem({
      itemName,
      type,
      brand,
      size,
      colour,
      locationFound,
      imageUrls,
      host: req.user._id,
      description,
      timeFound
    });

    // Save to database
    const item = await foundItem.save();

    res.status(200).json({ message: `Created found item successfully ID: ${item._id}`, urlLocations: imageUrls });
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};

module.exports.editFoundRequest = async (req, res, next) => {
  const { foundRequestId } = req.body;
  const user = req.user;
  const foundItem = await FoundItem.findById(foundRequestId);
  let imageUrls = [];

  try {
    if (!user.isAdmin && !foundItem.host.equals(user._id)) {
      throw new Error('401 Unauthorized: User does not own found request');
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToS3('found-items', file));
      imageUrls = await Promise.all(uploadPromises);
    }

    const update = {
      itemName: req.body.itemName ? req.body.itemName : foundItem.itemName,
      type: req.body.type ? req.body.type : foundItem.type,
      brand: req.body.brand ? req.body.brand : foundItem.brand,
      size: req.body.size ? req.body.size : foundItem.size,
      colour: req.body.color ? req.body.color : foundItem.colour,
      locationFound: req.body.locationFound ? req.body.locationFound : foundItem.locationFound,
      imageUrls: imageUrls ? imageUrls : foundItem.imageUrls,
      description: req.body.description ? req.body.description : foundItem.description,
      timeFound: req.body.timeFound ? req.body.timeFound : foundItem.timeFound
    };

    // update in database
    await FoundItem.findOneAndUpdate({ _id: foundRequestId }, update)
    res.status(200).json({ message: 'Editted found item successfully', urlLocations: imageUrls });
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
};

module.exports.deleteFoundRequest = async (req, res, next) => {
  const foundRequestId = req.params.id
  const user = req.user;
  const foundItem = await FoundItem.findById(foundRequestId);

  try {
    if (!user.isAdmin && !foundItem.host.equals(user._id)) {
      throw new Error('401 Unauthorized: User does not own found request')
    }
    await FoundItem.findByIdAndDelete(foundRequestId);
  } catch (err) {
    errorHandler(err, res);
    next(err);
  }
}

module.exports.getUserPosts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch Lost Items
    const lostItems = await LostItem.find({ host: userId }).select("-__v");

    // Fetch Found Items
    const foundItems = await FoundItem.find({ host: userId }).select("-__v");
    res.json({ userPosts: { lostItems, foundItems } })
  } catch (error) {
    console.error("Error fetching user's items:", error);
    res.status(500).json({ message: 'Error fetching user requests' });
  }
};

module.exports.getSimilarItems = async (req, res, next) => {
  const user = req.user;
  
  try {
    const lostItemId = req.params.id;

    // find the correspoining lost item
    const lostItem = await LostItem.findById(lostItemId);

    // if this item does not exist, return error
    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    if (!user.isAdmin && !user._id.equals(lostItem.host._id)) {
      return res.status(403).json({ message: 'Only the lost item host can fetch similar items' });
    }

    const foundItems = await FoundItem.find(
      // exclude the current user's found items
      // host: { $ne: mongoose.Types.ObjectId(excludedHostId) }
    ).select("-__v");

    const fuseOptions = {
      includeScore: true,
      // You can add more fields here based on what you'd like to compare
      findAllMatches: true,
      keys: ['itemName', 'type', 'brand', 'colour', 'description'],
      threshold: 0.8, // Adjust this threshold to your needs for fuzziness
    };

    const fuse = new Fuse(foundItems, fuseOptions);

    // Create an array of existing property values
    let searchTerms = [];
    for (const key of fuseOptions.keys) {
      lostItem[key] && searchTerms.push(lostItem[key].replace(/\s+/g, ' | '));
    }

    // Join the terms using the '|' to create a string for a fuzzy 'OR' type search
    let searchString = searchTerms.join(' | ');

    console.log(searchString);
    // Perform a search using the constructed search string
    const searchResults = fuse.search(searchString);

    const topResults = searchResults
      // .slice(0, 30) // Limit to the top 30 results
      .map(result => ({ ...result.item._doc, score: result.score }));

    res.status(200).json(topResults);
  } catch (error) {
    console.error("Error fetching similar items:", error);
    res.status(500).json({ message: 'Error fetching similar items' });
  }
}

module.exports.createPotentialMatch = async (req, res, next) => {
  const { lostRequestId, foundItemId } = req.body;
  const user = req.user; // the logged-in user

  try {
    const lostItem = await LostItem.findById(lostRequestId);
    const foundItem = await FoundItem.findById(foundItemId).populate("host").exec();

    if (!lostItem || !foundItem) {
      throw new Error('404 Not Found: Lost or Found item not found');
    }

    if (!user.isAdmin && !lostItem.host.equals(user._id)) {
      throw new Error('401 Unauthorized: User does not own lost request');
    }

    const hostEmail = foundItem.host.email;

    // Check if the match already exists
    const existingMatch = await PotentialMatch.findOne({ lostId: lostRequestId, foundId: foundItemId });
    if (!existingMatch) {
      const newPotentialMatch = new PotentialMatch({ lostId: lostRequestId, foundId: foundItemId });
      await newPotentialMatch.save();
      res.status(200).json({ message: 'Created potential match', hostEmail });
    } else {
      // intentionally send 200
      res.status(200).json({ message: 'Match already exists', hostEmail });
    }
    
  } catch (err) {
    errorHandler(err, res); 
    next(err);
  }
};

module.exports.lostAndFoundHandoff = async (req, res, next) => {
  const { foundItemId } = req.body;
  const user = req.user; // the logged-in user

  try {
    const foundItem = await FoundItem.findById(foundItemId);

    if (!foundItem) {
      throw new Error('404 Not Found: Found item not found (lol)');
    }

    // ensure only the current host can hand off the item
    if (!user.isAdmin && !foundItem.host.equals(user._id)) {
      throw new Error('401 Unauthorized: User does not own found request');
    }

    // set the host of the found item to be the lost and found
    const lostAndFoundAdmin = await User.findOne({ isAdmin: true });
    if (!lostAndFoundAdmin) {
      throw new Error('Lost and Found Admin not found');
    }

    foundItem.host = lostAndFoundAdmin._id;
    await foundItem.save();

    res.status(200).json({ message: 'Item handed off to lost and found successfully.' });

  } catch (err) {
    errorHandler(err, res); 
    next(err);
  }
};


async function uploadToS3 (folder, file) {
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
