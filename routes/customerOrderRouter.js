const express = require('express');
const {
  getAllOrders,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  completeOrder,
  checktable,
  update,
  getOtherOrders,
  getAll,
} = require("../controllers/customerOrderController");
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/:id').get(getSingleOrder);
router.route('/').get(protect,getAllOrders);
router.route('/update-order/:id').patch(updateOrderStatus);
router.route("/update-status/:id").patch(update);
router.route("/orderinfo/:id").get(protect, getOrders);
router.route("/otherorders/:id").get(protect, getOtherOrders);
router.route("/completeorder").post(protect, completeOrder);
router.route("/checktable").post(protect, checktable);
router.route("/:offset/:user").get(protect, getAll);
module.exports = router;
