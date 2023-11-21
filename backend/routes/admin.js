const express = require('express');
const { checkRequiredAttributes, authenticate, adminAuthenticate } = require('../middlewares/user');
const AdminController = require('../controllers/admin');
const multerUpload = require("../middlewares/multer");

const router = express.Router();

router.route('/allLostItems')
  .get(
    adminAuthenticate,
    async (req, res) => {
      try {
        await AdminController.getAllLostItems(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Get All Lost Items Error: ${err}` })
      }
    }
  )
router.route('/allFoundItems')
  .get(
    adminAuthenticate,
    async (req, res) => {
      try {
        await AdminController.getAllFoundItems(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Get All Found Items Error: ${err}` })
      }
    }
  )
router.route('/allPotentialMatches')
  .get(
    adminAuthenticate,
    async (req, res) => {
      try {
        await AdminController.getAllPotentialMatches(req, res, errorHandler);
      } catch (err) {
        res.json({ message: `Get All Potential Matches Error: ${err}` })
      }
    }
  )

router.route('/emailAdmin')
  .post(
    authenticate,
    async (req, res) => {
      try {
        await AdminController.emailAdmin(req, res, errorHandler)
      } catch (err) {
        res.json({ message: `Email Admin Error: ${err}` })
      }
    }
  )


const errorHandler = (err) => { }

module.exports = router;