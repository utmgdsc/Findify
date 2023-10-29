const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    brand: { type: String, required: true },
    size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
    colour: { type: String, required: true },
    locationLost: { type: String, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // could add default value of admin

    // optional fields:
    imageUrls: [{ type: String, default: [] }],
    timeLost: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    matchedFoundItem: { type: mongoose.Schema.Types.ObjectId, ref: 'foundItem', default: null }
  },
  { timestamps: true }
);

const FoundItemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    brand: { type: String, required: true },
    size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
    colour: { type: String, required: true },
    locationFound: { type: String, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // could add default value of admin

    // optinal fields:
    imageUrls: [{ type: String, default: [] }],
    timeFound: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    matchedLostItem: { type: mongoose.Schema.Types.ObjectId, ref: 'lostItem', default: null }
  },
  { timestamps: true }
);

const PotentialMatchSchema = new mongoose.Schema({
  lostId: { type: mongoose.Schema.Types.ObjectId, ref: 'lostItem', required: true },
  foundId: { type: mongoose.Schema.Types.ObjectId, ref: 'foundItem', required: true }
});

const lostItemModel = mongoose.model('lostItem', LostItemSchema);
const foundItemModel = mongoose.model('foundItem', FoundItemSchema);
const potentialMatchModel = mongoose.model('potentialMatch', PotentialMatchSchema);

module.exports = { LostItem: lostItemModel, FoundItem: foundItemModel, PotentialMatch: potentialMatchModel };