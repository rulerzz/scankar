const CustomerOrder = require("../models/customerOrderModel");
const webPush = require("web-push");
const User = require("./../models/userModels");
const Item = require("./../models/itemModel");
const completedOrderModel = require("../models/completedOrderModel");
const mongoose = require("mongoose");
const orderModel = require("../models/orderModel");

// to get all order
exports.getAllOrders = async (req, res) => {
  try {
    let orders;
    let user = await User.findById(req.user._id);
    if (user.role == "superadmin") {
      orders = await CustomerOrder.find()
        .skip(Number(req.query.offset))
        .limit(10)
        .sort({ palced_time: "desc" });
    } else {
      orders = await CustomerOrder.find({ user: req.user._id,
      process : ["Pending", "Running"]
      })
        .skip(Number(req.query.offset))
        .limit(10)
        .sort({ palced_time: "desc" });
    }

    // console.log("customer order", orders)
    const count = await CustomerOrder.countDocuments();
    res.status(200).json({
      status: "Success",
      results: orders.length,
      data: {
        orders,
      },
      count: count,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.getOrders = async (req, res) => {
  try {
    let orders = await CustomerOrder.find({
      user: req.user._id,
      status: ["Placed"],
      orderType: ["Dine In"]
    }).sort({ palced_time: "desc" });

    res.status(200).json({
      status: "Success",
      data: orders,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.getOtherOrders = async (req, res) => {
  try {
    let orders = await CustomerOrder.find({
      user: req.user._id,
      status: ["Placed"],
      process: ["Pending", "Running"],
      orderType: ["Take Home", "Delivery"],
    }).sort({ palced_time: "desc" });

    res.status(200).json({
      status: "Success",
      data: orders,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.getnewOrders = async (req, res) => {
  try {
    console.log("userIddd", req.user._id);
    const orders = await CustomerOrder.find({ userId: req.user._id });
    console.log("customer order", orders);
    res.status(200).json({
      status: "Success",
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
// to get a single order
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: "Invalid Order ID",
    });
  }
};

// to complete an order
exports.completeOrder = async (req, res) => {
  try {
    let order = await CustomerOrder.create({
      orderType: req.body.orderType,
      status: req.body.status,
      process: req.body.process,
      booker: req.body.booker,
      price: req.body.price,
      tableNo: Number(req.body.tableNo),
      user: mongoose.Types.ObjectId(req.body.user),
      items: req.body.items,
      discount: req.body.discount,
      placed_time: req.body.placed_time,
      instruction: req.body.instruction,
      address: req.body.address
    });
    res.status(201).json({
      status: "Success",
      message: "Order added to DB",
      data: order
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};

exports.checktable = async (req, res) => {
  try {
    const order = await CustomerOrder.find({tableNo : req.body.tableno , status : "Placed", user: req.body.user});
    res.status(200).json({
      status: "success",
      data: order
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};
// update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await CustomerOrder.findByIdAndUpdate(
      req.params.id,
      {
        orderType: req.body.orderType,
        booker: req.body.booker,
        price: req.body.price,
        items: req.body.items,
        discount: req.body.discount,
        instruction: req.body.instruction,
        address: req.body.address,
      },
      {
        new: true,
        useFindAndModify: false
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const order = await CustomerOrder.findByIdAndUpdate(
      req.params.id,
      {
        status : req.body.status,
        process: req.body.process
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};