const mongoose = require("mongoose");
const completedOrderModel = require("./completedOrderModel");
const User = require("./userModels");
const ObjectId = mongoose.ObjectId;

const customerOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [

    ],
    booker: {
      type: String
    },
    userId: {
      type: String
    },
    price: {
      type: Number
    },
    discount: {
      type: Number
    },
    orderType: {
      type: String,
      default: "Take Home",
      enum: ["Dine In", "Take Home", "Delivery"],
      required: true
    },
    address: String,
    placed_time: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: "Placed",
      enum: ["Placed", "Billed", "Closed"]
    },
    process: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Running", "Completed", "Rejected"]
    },
    instruction: {
      type: String,
      default: ""
    },
    tableNo: {
      type: Number
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerOrder", customerOrderSchema);
