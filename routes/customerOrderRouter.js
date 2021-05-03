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
  search,
  getBill,
  checkroom,
  changebestsellingstatus,
  allbestsellingitems,
  alloffers,
} = require("../controllers/customerOrderController");
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/:id').get(protect, getSingleOrder);
router.route("/getbill/:id").get(getBill);
router.route('/').get(protect,getAllOrders);
router.route('/update-order/:id').patch(protect, updateOrderStatus);
router.route("/update-status/:id").patch(protect, update);
router.route("/orderinfo/:id").get(protect, getOrders);
router.route("/otherorders/:id").get(protect, getOtherOrders);
router.route("/completeorder").post(protect, completeOrder);
router.route("/checktable").post(protect, checktable);
router.route("/checkroom").post(protect, checkroom);
router.route("/changebestsellingstatus").post(protect, changebestsellingstatus);
router.route("/allbestsellingitems/:id").get(protect, allbestsellingitems);
router.route("/alloffers/:id").get(protect, alloffers);
router.route("/:offset/:user").get(protect, getAll);
router.route("/searchitems/:user/:name").get(protect, search);

module.exports = router;
