const crypto = require("crypto");
const User = require("../models/userModels");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/emailHandler");
// routes

// register 
exports.register = asyncHandler(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      passwordConfirm,
      role,
      ownerType,
    } = req.body;

    //create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      passwordConfirm,
      role,
      ownerType,
    });
    res.status(200).json({
      status: "Success",
      user: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
});

// login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //validation email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please enter email id and password", 400));
  }
  //check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credential", 401));
  }
  //check if password matchs
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid password", 401));
  }
  //create token
  sendTokenResponse(user, 200, res);
});

// ADMIN LOGIN
exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validation email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please enter email id and password", 400));
  }
  //check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credential", 401));
  }
  //check if password matchs
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid password", 401));
  }
  //create token
  sendTokenResponse(user, 200, res);
});

// forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email has been sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const type = user.ownerType;

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 100
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options, user).json({
    message: "Succesful",
    token,
    user,
  });
};

// to see the logged user
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});
