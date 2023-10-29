const express = require('express')
const { authenticate, checkRequiredAttributes } = require('../middlewares/user')
const ItemController = require('../controllers/item');

const router = express.Router();

router.route('/createLostRequest')
  .post(authenticate, checkRequiredAttributes(["type", "brand", "size", "colour", "locationLost"]), async (req, res) => {
    try {
      await ItemController.createLostRequest(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Create Lost Request Error: ${err}` })
    }
  })
router.route('/editLostRequest')
  .post(authenticate, checkRequiredAttributes([]), async (req, res) => {
    try {
      await ItemController.editLostRequest(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Edit Lost Request Error: ${err}` })
    }
  })

router.route('/createFoundReport')
  .post(authenticate, checkRequiredAttributes(["type", "brand", "size", "colour", "locationFound"]), async (req, res) => {
    try {
      await ItemController.createFoundReport(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Create Found Report Error: ${err}` })
    }
  })
router.route('/editFoundReport')
  .post(authenticate, checkRequiredAttributes([]), async (req, res) => {
    try {
      await ItemController.editFoundReport(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Edit Found Report Error: ${err}` })
    }
  })

router.route('/getUserPosts')
  .get(authenticate, checkRequiredAttributes(['userId']), async (req, res) => { // ? should required attr be userId or user token?
    try {
      // data should be object with structure { lostRequests: List<LostRequestObj>, foundReports: List<FoundReportObj> }
      const data = await ItemController.getUserPosts(req, res, errorHandler);
      res.json({ userPosts: data })
    } catch (err) {
      res.json({ message: `Get User Posts Error: ${err}` })
    }
  })

router.route('/getItemInfo')
  .get(authenticate, checkRequiredAttributes(['itemId'], async (req, res) => {
    try {
      await ItemController.getItemInfo(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Get Item ${req.body.itemId} Info Error: ${err}` })
    }
  }))

router.route('/getItemMatches')
  .get(authenticate, checkRequiredAttributes(['itemId'], async (req, res) => {
    try {
      await ItemController.getSimilarItems(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Get Item ${req.body.itemId} Matches Error: ${err}` })
    }
  }))

router.route('/claimItem')
  // userId refers to lostItem host ID: needs to match with current logged in user for authentication purposes
  .post(authenticate, checkRequiredAttributes(['userId', 'lostItmeId', 'foundItemId'], async (req, res) => { // ? should required attr be userId or user token?
    try {
      await ItemController.claimItem(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Claim Item Error: ${err}` })
    }
  }))
router.route('/itemHandover')
  // userId refers to foundItem host ID: needs to match with current logged in user for authentication purposes
  .post(authenticate, checkRequiredAttributes(['userId', 'lostItemId', 'foundItemId'], async (req, res) => { // ? should required attr be userId or user token?
    try {
      await ItemController.itemHandover(req, res, errorHandler);
    } catch (err) {
      res.json({ message: `Item Handover Error: ${err}` })
    }
  }))

const errorHandler = (err) => { }

module.exports = router;