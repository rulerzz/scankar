const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: 32,
      required: [true, "Please add  firstname"],
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 32,
      required: [true, "Please add lastname"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      loadClass: true,
      // validate: [validator.isEmail, 'Please provode a valid email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    categories: [
      {
        name: String,
        link: String,
      },
    ],
    gst: {
      type: Number,
      trim: true,
    },
    servicecharge: {
      type: Number,
      trim: true,
    },
    servicechargeenable:{
      type: Boolean,
      trim: true
    },
    companyName: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    address1: {
      type: String,
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zip: {
      type: String,
      trim: true,
    },
    autoBilling: {
      type: Boolean,
      trim: true,
    },
    mobileNumber: {
      type: String,
      // required: true,
      trim: true,
      unique: true,
    },
    photo: String,
    userInfo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "InActive"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 8,
      select: false,
    },

    subscriptions: {
      type: Object,
      minimize: false,
    },
    tableCount: {
      type: Number,
    },
    // subscription: {
    //   type: String,
    //   required: [true, 'Please confirm your password'],
    //   validate: {
    //     //  This only works on create and save
    //     validator: function (el) {
    //       return el === this.password;
    //     },
    //     message: 'Passwords are not the same',
    //   },
    // },
    // salt: String,
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "accounts", "superadmin"],
      required: true,
    },

    ownerType: {
      type: String,
      default: "returantowner",
      enum: ["returantowner", "hotelowner"],
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

//hashing password with bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, 12);
  // this.passwordConfirm = undefined;
  // next();
});

// sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//match entered password with stored password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// generate hash password reset token
userSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(25).toString("hex");
  // hash token and set resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.resetPasswordToken);
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("User", userSchema);