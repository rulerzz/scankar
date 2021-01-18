const express = require('express');
const cloudUpload = require('../utils/multer');

const {
  viewAllResturantDetails,
  viewSingleResturantDetails,
  createResturantDetails,
  updateResturantDetails,
  deleteResturantDetails,
  // fetchAvailableSeats,
} = require('../controllers/resturantDetailsController');

const router = express.Router();

router
  .route('/')
  .get(viewAllResturantDetails)
  .post(cloudUpload, createResturantDetails);
router
  .route('/:id')
  // .get(fetchAvailableSeats)
  .patch(updateResturantDetails)
  .delete(deleteResturantDetails);

router.route('/single/:id').get(viewSingleResturantDetails);
module.exports = router;
