const express = require('express');
const {
  getAllOrders,
  getOrders,
  getSingleOrder,
  createOrder,
  updateOrderStatus,
} =  require('../controllers/customerOrderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/:id').get(getSingleOrder);
router.route('/').get(protect,getAllOrders);
router.route('/create-order').post(createOrder);
router.route('/update-order/:id').patch(updateOrderStatus);

module.exports = router;
