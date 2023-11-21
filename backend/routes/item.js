const express = require('express');
const { authenticate, checkRequiredAttributes } = require('../middlewares/user');
const ItemController = require('../controllers/item');
const multerUpload = require("../middlewares/multer");

const router = express.Router();

router.route('/lostRequest/:id')
  .get(
    authenticate,
    async (req, res) => {
      try {
        await ItemController.getLostRequest(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Get Lost Request Error: ${err}` })
      }
    }
  )
  .delete(
    authenticate,
    async (req, res) => {
      try {
        await ItemController.deleteLostRequest(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Delete Lost Request Error: ${err}` });
      }
    }
  )

router.route('/lostRequest')
  .post(
    authenticate,
    multerUpload,
    checkRequiredAttributes(["itemName", "type", "brand", "size", "colour", "locationLost"]),
    async (req, res) => {
      try {
        await ItemController.createLostRequest(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Create Lost Request Error: ${err}` })
      }
    }
  )
  .put(
    authenticate,
    multerUpload,
    checkRequiredAttributes(["lostRequestId"]),
    async (req, res) => {
      try {
        await ItemController.editLostRequest(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Edit Lost Request Error: ${err}` })
      }
    }
  )


router.route('/foundRequest/:id')
  .get(
    authenticate,
    async (req, res) => {
      try {
        await ItemController.getFoundRequest(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Get Found Request Error: ${err}` })
      }
    }
  )
  .delete(
    authenticate,
    async (req, res) => {
      try {
        await ItemController.deleteFoundRequest(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Delete Found Request Error: ${err}` });
      }
    }
  )

router.route('/foundRequest')
  .post(
    authenticate,
    multerUpload,
    checkRequiredAttributes(["itemName", "type", "brand", "size", "colour", "locationFound"]),
    async (req, res) => {
      try {
        await ItemController.createFoundRequest(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Create Found Request Error: ${err}` })
      }
    }
  )
  .put(
    authenticate,
    multerUpload,
    checkRequiredAttributes(["foundRequestId"]),
    async (req, res) => {
      try {
        await ItemController.editFoundRequest(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Edit Found Request Error: ${err}` })
      }
    }
  )

router.route('/getSimilarItems/:id')
  .get(
    authenticate,
    async (req, res) => {
      try {
        await ItemController.getSimilarItems(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Create Found Request Error: ${err}` })
      }
    }
  )

router.route('/getUserPosts')
  .get(authenticate,
    async (req, res) => {
      try {
        await ItemController.getUserPosts(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Get User Posts Error: ${err}` })
      }
    })

// matching related endpoints:
router.route('/createPotentialMatch')
  .post(authenticate,
    checkRequiredAttributes(["foundItemId"]),
    async (req, res) => {
      try {
        await ItemController.createPotentialMatch(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Error creating potential match: ${err}` })
      }
    })


router.route('/lostAndFoundHandoff')
  .post(authenticate,
    checkRequiredAttributes(["foundItemId"]),
    async (req, res) => {
      try {
        await ItemController.lostAndFoundHandoff(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Error handing off the item to the lostAndFound: ${err}` });
      }
    })
const errorHandler = (err) => { }

module.exports = router;

// router.route('/claimItem')
//   // userId refers to lostItem host ID: needs to match with current logged in user for authentication purposes
//   .post(authenticate, checkRequiredAttributes(['userId', 'lostItmeId', 'foundItemId'], async (req, res) => { // ? should required attr be userId or user token?
//     try {
//       await ItemController.claimItem(req, res, errorHandler);
//     } catch (err) {
//       res.json({ message: `Claim Item Error: ${err}` })
//     }
//   }))
// router.route('/itemHandover')
//   // userId refers to foundItem host ID: needs to match with current logged in user for authentication purposes
//   .post(authenticate, checkRequiredAttributes(['userId', 'lostItemId', 'foundItemId'], async (req, res) => { // ? should required attr be userId or user token?
//     try {
//       await ItemController.itemHandover(req, res, errorHandler);
//     } catch (err) {
//       res.json({ message: `Item Handover Error: ${err}` })
//     }
//   }))
