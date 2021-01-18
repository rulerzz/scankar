const express = require('express');
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrderStatus,
  updateOrderProcess,
} = require('../controllers/orderController');

const router = express.Router();

router.route('/').get(getAllOrders).post(createOrder);

router
  .route('/:id')
  .get(getSingleOrder)
  .patch(updateOrderStatus)
  .patch(updateOrderProcess);

module.exports = router;
