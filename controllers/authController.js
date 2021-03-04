const crypto = require("crypto");
const User = require("../models/userModels");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/emailHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
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
exports.userLogin = (request, response, next) => {
  User.find({ email: request.body.user })
    .select('+password')
    .then((user) => {
      if (user.length < 1) {
        // Check for phone
        User.find({mobileNumber : request.body.user}).select('+password').then((phone) => {
          if (phone.length < 1) {
            return next(new ErrorResponse("Invalid User", 401));
          }
          else{
            checkPassword(phone, request.body.password).then((result) => {
              if (result) {
                const token = jwt.sign(
                  { id: phone._id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: process.env.JWT_EXPIRE,
                  }
                );

                const options = {
                  expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 100
                  ),
                  httpOnly: true,
                };

                if (process.env.NODE_ENV === "production") {
                  options.secure = true;
                }

                response.status(200).json({
                  status: "Success",
                  message: "User matched!",
                  token,
                  user : phone,
                });
              } else {
                response.status(400).json({
                  status: "Error",
                  message: "Passwords do not match!",
                });
              }
            });
          }
        });
      }
      // GOT A MATCH CHECK PASS
      else {
        checkPassword(user, request.body.password).then((result) => {
          if (result) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRE,
            });

            const options = {
              expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 100
              ),
              httpOnly: true,
            };

            if (process.env.NODE_ENV === "production") {
              options.secure = true;
            }

            response.status(200).json({
              status: "Success",
              message: "User matched!",
              token,
              user,
            });
          } else {
            response.status(400).json({
              status: "Error",
              message: "Passwords do not match!",
            });
          }
        });
      }
    })
    .catch((findError) => {
      response.status(400).json({
        status: "Error",
        message: findError.message,
      });
    });
};
function checkPassword(user, password) {
  return new Promise((resolve) => {
    bcrypt.compare(password, user[0].password, function (err, result) {
      resolve(result);
    });
  });
}
exports.userRegister = (request, response, next) => {
  User.create(request.body)
    .then((user) => {
       response.status(200).json({
         status: "Success"
       });
    })
    .catch((findError) => {
      response.status(400).json({
        status: "Error",
        code: findError,
        message: findError.message,
      });
    });
};
exports.sendotp = (request, response, next) => {
  //var otpGenerator = require("otp-generator");
  //let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false , alphabets : false});
  User.find({ mobileNumber: request.body.phone }).then((user) => {
    console.log(user)
    if(user.length < 1){
      // CREATE USER
        // SEND OTP
        sendotp(request.body.phone , 0);
         response.status(200).json({
           status: "success",
         });
    }
    else{
      // UPDATE OTP FIELD AND SEND OTP TO HIS PHONE
      sendotp(request.body.phone , 1);
       response.status(200).json({
         status: "success",
       });
    }
  });
};
exports.userExists = (request, response, next) => {
  User.find({ mobileNumber : request.body.phone })
    .then((user) => {
      if(user.length < 1){
        response.status(200).json({
          status: 1,
        });
      }
      else{
        response.status(200).json({
          status: 0,
        });
      }
    });
};
function sendotp(phone, val){
  const req = http.request(
    "http://sms.smsmenow.in/generateOtp.jsp?userid=busrest&key=2897245792XX&mobileno=+91" +
      phone +
      "&timetoalive=60",
    (res) => {
      res.on("data", (d) => {
        let parse = JSON.parse(d);
        if(val === 0){
          User.create({
            mobileNumber: phone,
            ownerType: "registered",
            role: "user",
            otp: parse.otpId,
          }).then((data) => {
          });
        }else{
          User.updateOne(
            { mobileNumber: phone },
            { otp: parse.otpId },
            { new: true, useFindAndModify: false },
            function (err, doc) {
            }
          );
        }
      });
    }
  );
  req.on("error", function (e) {
    console.log("problem with request: " + e.message);
  });
  // write data to request body
  req.write("data\n");
  req.write("data\n");
  req.end();
};
exports.otplogin = (request, response, next) => {
  User.find({ mobileNumber: request.body.phone })
    .then((user) => {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      response.status(200).json({
        status: "Success",
        message: "User matched!",
        token,
        user: user,
      });
    })
    .catch((findError) => {
      response.status(400).json({
        status: "Error",
        message: findError.message,
      });
    });
};