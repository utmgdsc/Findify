const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  dateCreated: { type: Date, default: Date.now() },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  // * added categories for size such as small, medium, large, x-large. We can remove if not needed
  size: { type: String, enum: ['sm', 'md', 'lg', 'xl'], required: true },
  colour: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  locationLost: { type: String, required: true },
  timeLost: { type: Date, default: Date.now() },
  description: { type: String },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // could add default value of admin
  isActive: { type: Boolean, default: true },
  matchedLostItem: { type: mongoose.Schema.Types.ObjectId, ref: 'foundItem', default: null }
});

const FoundItemSchema = new mongoose.Schema({
  dateCreated: { type: Date, default: Date.now() },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  // * added categories for size such as small, medium, large, x-large. We can remove if not needed 
  size: { type: String, enum: ['sm', 'md', 'lg', 'xl'], required: true },
  colour: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  locationFound: { type: String, required: true },
  timeFound: { type: Date, default: Date.now() },
  description: { type: String },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // could add default value of admin
  isActive: { type: Boolean, default: true },
  matchedFoundItem: { type: mongoose.Schema.Types.ObjectId, ref: 'lostItem', default: null }
})

const PotentialMatchSchema = new mongoose.Schema({
  lostId: { type: mongoose.Schema.Types.ObjectId, ref: 'lostItem', required: true },
  foundId: { type: mongoose.Schema.Types.ObjectId, ref: 'foundItem', required: true }
})

const lostItemModel = mongoose.model('lostItem', LostItemSchema);
const foundItemModel = mongoose.model('foundItem', FoundItemSchema);
const potentialMatchModel = mongoose.model('potentialMatch', PotentialMatchSchema)

module.exports = { LostItem: lostItemModel, FoundItem: foundItemModel, PotentialMatch: potentialMatchModel };