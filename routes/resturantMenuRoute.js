const express = require('express');
const {
  getAllItemsOfResturant,
  getSingleItemOfResturant,
  updateItemOfResturant,
  deleteItemOfResturant,
  createItemOfResturant,
  createBulkItemsOfResturant,
} = require('../controllers/resturantMenuController');

const router = express.Router();

router
  .get('/getallitemsofresturant/:id', getAllItemsOfResturant)
  .get('/getsingleitemofresturant/:id', getSingleItemOfResturant)
  .patch('/updateitemofresturant/:id', updateItemOfResturant)
  .delete('/deleteitemofresturant/:id', deleteItemOfResturant)
  .post('/createitemofresturant', createItemOfResturant)
  .post('/createbulkitemsofresturant', createBulkItemsOfResturant);

module.exports = router;
