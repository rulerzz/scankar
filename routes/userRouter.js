const express = require("express");
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
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
  getAllUsersData,
  deleteCategory,
  findCategoryOrItems,
  updateCategory,
  bulkUpload,
  setsocketid,
  sendping,
  searchordersforuser,
  filteruser,
  getoffers, createOffer, updateOffer, deleteOffer
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");
const cloudUpload = require("../utils/multer");
const uploadFile = require("../utils/excelMulter");

const router = express.Router();

router.route("/").get(protect, getAllUsers).post(protect, createUser);
router.route("/setsocketid/:userid/:socketid").get(protect, setsocketid);
router.route("/endurlupdate").put(protect, updateUser);
router.route("/getcategory/:id").get(protect, getSingleUsercategory);
router
  .route("/category/:id/:name/:description/:cuisine")
  .get(protect, getSingleUsercategoryitm)
  .post(protect, cloudUpload, createCategory)
  .put(protect, cloudUpload, updateCategory);
router.route("/deletecategory/:userid/:categoryid").get(protect, deleteCategory);
router.route("/getoffers/:id").get(protect, getoffers);
router
  .route("/createoffer")
  .post(protect, cloudUpload, createOffer);
router
  .route("/updateoffer")
  .put(protect, cloudUpload, updateOffer);
router.route("/update").put(update);
router
  .route("/insertuseritem/:id")
  .get(protect, getalldata)
  .post(protect, cloudUpload, createItem);
router.route("/deleteuseritem/:id/:categoryid").get(protect, deleteItem);
router.route("/servicecharge/:id").post(protect, setCharge);
router.route("/updateitemrouter").post(protect, updateItem);
router
  .route("/updatepictureitemroute")
  .post(protect, cloudUpload, updateItemWithPic);
router.route("/gst/:id").post(protect, setGst);
router.route("/search").get(protect, getAllUsersData);
router
  .route("/:id")
  .get(protect, getSingleUser)
  .delete(protect, deleteUser)
  .post(protect, cloudUpload, uploadpfp);
router.route("/search/:id").get(protect, findCategoryOrItems);
router.route("/bulkupload/:id").post(protect, uploadFile, bulkUpload);
router.route("/sendping/:id/:tableNo").get(protect, sendping);
router.route("/orders/:id").get(protect, searchordersforuser);
router.route("/removeoffer/:id").get(protect, deleteOffer);
router.route("/query/:name").get(protect, filteruser);
module.exports = router;
