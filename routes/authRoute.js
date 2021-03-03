const express = require('express');
const {
  register,
  signup,
  login,
  getMe,
  adminLogin,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  userRegister,
  userLogin,
  sendotp,
  userExists,
  otplogin,
} = require("../controllers/authController");
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/adminLogin', adminLogin);
router.post('/userlogin', userLogin);
router.post("/otplogin", otplogin);
router.post("/userregister", userRegister);
router.post("/sendotp", sendotp);
router.post("/checkuser", userExists);
router.post('/forgotPassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
// router.put('/updateDetails/', updateDetails);
// router.put('/updatePassword/', updatePassword);
router.get('/getLoggedInUser', protect, getMe);
module.exports = router;
