const mongoose = require("mongoose");
const completedOrderModel = require("./completedOrderModel");
const User = require("./userModels");
const ObjectId = mongoose.ObjectId;

const customerOrderSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    userId: {
      type: String,
      required: true,
    },
    subscriptions: {
      type: Object,
      minimize: false,
    },

    price: {
      type: Number,
      required: true,
    },

    orderType: {
      type: String,
      default: "Take Home",
      enum: ["Dine In", "Take Home", "Delivery"],
      required: true,
    },
    address: String,
    palced_time: {
      type: Date,
      default: Date.now,
    },
    updated: Date,
    status: {
      type: String,
      default: "Placed",
      enum: ["Placed", "Billed"],
    },
    ordersubscriptions: {
      type: Object,
    },
    process: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Running", "Completed"],
    },
    instruction: {
      type: String,
      default: "",
    },
    noOfSeatsRequested: {
      type: Number,
    },
    user: {
      type: ObjectId,
      ref: User,
    },
    completed: {
      type: ObjectId,
      ref: completedOrderModel,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerOrder", customerOrderSchema);
