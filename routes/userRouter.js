const express = require('express');
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  subscription,
  endusersubscription,
  getSingleUsercategory,
  getSingleUsercategoryitm,
  update,
  createCategory,
  uploadpfp,
  createItem,
  getalldata,
  setGst,
  setCharge,
  deleteItem,
  updateItem,
  updateItemWithPic,
  getAllUsersData
} = require("../controllers/userController");
const { protect, authorize } = require('../middleware/auth');
const cloudUpload = require("../utils/multer");

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/notifications/subscribe').post(subscription);
router.route('/enduser/notifications/subscribe').post(endusersubscription);
router.route('/endurlupdate').put(updateUser);
router.route('/getcategory/:id').get(getSingleUsercategory);
router.route('/category/:id/:name').get(getSingleUsercategoryitm).post(protect,cloudUpload,createCategory);
router.route("/update").put(update);
router.route("/insertuseritem/:id").get(getalldata).post(protect, cloudUpload, createItem);
router.route("/deleteuseritem/:id").get(deleteItem);
router.route("/servicecharge/:id").post(protect, setCharge);
router.route("/updateitemrouter").post(updateItem);
router.route("/updatepictureitemroute").post(protect, cloudUpload, updateItemWithPic);
router.route("/gst/:id").post(protect, setGst);
router.route("/search").get(protect, getAllUsersData);
router.route('/:id').get(getSingleUser).delete(deleteUser).post(protect,cloudUpload, uploadpfp);
module.exports = router;
