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
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: false,
      loadClass: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    sgst: {
      type: Number,
      trim: true,
      default: 0,
    },
    gstin: {
      type: String,
      trim: true,
      default: "",
    },
    cgst: {
      type: Number,
      trim: true,
      default: 0,
    },
    servicecharge: {
      type: Number,
      trim: true,
      default: 0,
    },
    servicechargeenable: {
      type: Boolean,
      trim: true,
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
    enablecgst: {
      type: Boolean,
      trim: true,
    },
    enablesgst: {
      type: Boolean,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    photo: String,
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "InActive"],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    tableCount: {
      type: Number,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "accounts", "superadmin"],
      required: true,
    },
    ownerType: {
      type: String,
      default: "returantowner",
      enum: ["returantowner", "hotelowner","registered"],
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    configuration: {
      type : Array,
      default: []
    },
    socketid: {
      type: String
    },
    otp: {
      type : String
    }
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
