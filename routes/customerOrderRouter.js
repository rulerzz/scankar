const express = require('express');
const {
  getAllOrders,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  completeOrder,
  checktable,
  update,
} = require("../controllers/customerOrderController");
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/:id').get(getSingleOrder);
router.route('/').get(protect,getAllOrders);
router.route('/update-order/:id').patch(updateOrderStatus);
router.route("/update-status/:id").patch(update);
router.route("/orderinfo/:id").get(protect, getOrders);
router.route("/completeorder").post(protect, completeOrder);
router.route("/checktable").post(protect, checktable);
module.exports = router;
