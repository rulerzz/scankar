const CustomerOrder = require("../models/customerOrderModel");
const User = require("./../models/userModels");
const mongoose = require("mongoose");
const moment = require("moment");
var io = require("../app");

let emitcreateorderaction = function (data) {
  io.sockets.emit("emitcreateorderaction", data);
  console.log("Emitting order creation ping!");
};

exports.getAll = async (req, res) => {
  try {
    let orders;
    let count;
    let user = await User.findById(req.params.user);
    if (user.role == "superadmin") {
      orders = await CustomerOrder.find()
        .skip(Number(req.params.offset))
        .limit(10)
        .sort({ placed_time: "desc" });
      count = await CustomerOrder.countDocuments({});
    } else {
      orders = await CustomerOrder.find({
        user: req.params.user
      })
        .skip(Number(req.params.offset))
        .limit(10)
        .sort({ placed_time: "desc" });
      count = await CustomerOrder.countDocuments({
        user: req.params.user,
      });
    }
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
// to get all order
exports.getAllOrders = async (req, res) => {
  try {
    let orders;
    let count;
    const today = moment().startOf("day");
    let user = await User.findById(req.query.user);
    if (user.role == "superadmin") {
      orders = await CustomerOrder.find()
        .skip(Number(req.query.offset))
        .limit(10)
        .sort({ placed_time: "desc" });
      count = await CustomerOrder.countDocuments({});
    } else {
      orders = await CustomerOrder.find({
        user: req.user._id,
        $or: [
          { process: "Pending" },
          { process: "Running" },
          { process: "Completed" },
        ],
        $or: [{ status: "Placed" }, { status: "Billed" }],
        placed_time: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
      })
        .skip(Number(req.query.offset))
        .limit(10)
        .sort({ placed_time: "desc" });
      count = await CustomerOrder.countDocuments({
        user: req.user._id,
        $or: [
          { process: "Pending" },
          { process: "Running" },
          { process: "Completed" },
        ],
        $or: [{ status: "Placed" }, { status: "Billed" }, { status: "Closed" }],
        placed_time: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
      });
    }
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
    const today = moment().startOf("day");
    let orders = await CustomerOrder.find({
      user: req.params.id,
      $or: [{ status: "Placed" }],
      orderType: ["Dine In"],
      placed_time: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
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
    const today = moment().startOf("day");
    let orders = await CustomerOrder.find({
      user: req.params.id,
      status: ["Placed"],
      orderType: ["Take Home", "Delivery"],
      placed_time: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    }).sort({ placed_time: "desc" });

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
      address: req.body.address,
    });
    emitcreateorderaction(order);
    res.status(201).json({
      status: "Success",
      message: "Order added to DB",
      data: order,
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
    const today = moment().startOf("day");
    console.log(today)
    const order = await CustomerOrder.find({
      tableNo: req.body.tableno,
      status: "Placed",
      user: req.body.user,
      placed_time: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    });
    res.status(200).json({
      status: "success",
      data: order,
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

exports.update = async (req, res) => {
  try {
    const order = await CustomerOrder.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        process: req.body.process,
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
