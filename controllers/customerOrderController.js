const CustomerOrder = require("../models/customerOrderModel");
const order = require("./orderController");
const Admin = require("../models/userModels");
const Product = require("../models/productModel");
const { subscription } = require("./userController");
const webPush = require("web-push");
const User = require("./../models/userModels");
const Item = require("./../models/itemModel");
const completedOrderModel = require("../models/completedOrderModel");
const mongoose = require("mongoose");
const orderModel = require("../models/orderModel");
webPush.setVapidDetails(
  "mailto:test@example.com",
  process.env.Public_Key,
  process.env.Private_Key
);
// Controllers
// to get all order
exports.getAllOrders = async (req, res) => {
  try {
    let orders;
    let user = await User.findById(req.user._id);
    if (user.role == "superadmin") {
      orders = await CustomerOrder.find()
        .populate({
          path: "orders",
          populate: {
            path: "contents.item",
          },
        })
        .skip(Number(req.query.offset))
        .limit(10)
        .sort({ palced_time: "desc" });
    } else {
      orders = await CustomerOrder.find({ userId: req.user._id })
        .populate({
          path: "orders",
          populate: {
            path: "contents.item",
          },
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
      userId: req.user._id,
      process: ["Pending", "Running"],
    })
      .populate({
        path: "orders",
        populate: {
          path: "contents.item",
        },
      })
      .sort({ palced_time: "desc" });

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
    let orderlist = [];
    const newordeer = await completedOrderModel.create(req.body);
    req.body.orders.forEach(element => {
       orderlist.push({
         item : mongoose.Types.ObjectId(element._id),
         quantity : element.quantity
       });
    });
    console.log(orderlist);
    const order = await orderModel.create({
      contents: orderlist
    });
    await CustomerOrder.create({
      orderType: req.body.orderType,
      status: "Placed",
      process: "Running",
      userName: req.body.userName,
      price: req.body.total,
      noOfSeatsRequested: Number(req.body.noOfSeatsRequested),
      userId: req.body.userId,
      orders: [mongoose.Types.ObjectId(order._id)],
      completed: mongoose.Types.ObjectId(newordeer._id),
    });
    res.status(201).json({
      status: "Success",
      message: "Order added to DB",
      data: newordeer
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
    const order = await CustomerOrder.find({noOfSeatsRequested : req.body.tableno , process : "Running", userId: req.body.user});
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
      req.body,
      {
        new: true,
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

// In future need to add
