const Room = require("../models/roomModel");
const CustomerOrder = require("../models/customerOrderModel");
const moment = require("moment");

exports.status = async (req, res) => {
  try {
    const room = await Room.create({
      user: req.body.user,
      room: req.body.room,
      status: req.body.status,
    });
    res.status(200).json({
      room,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.rooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      user: req.params.user,
    });
    res.status(200).json({
      rooms
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.orders = async (req, res) => {
  try {
    const today = moment().startOf("day");
    let orders = await CustomerOrder.find({
      user: req.params.user,
      $or: [{ status: "Placed" }],
      orderType: ["Room"],
      placed_time: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    }).sort({ palced_time: "desc" });
    res.status(200).json({
      orders
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getstatus = async (req, res) => {
  try {
    const room = await Room.find({
      user: req.query.user,
      room: req.query.room,
    });
    res.status(200).json({
      room,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.updatestatus = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.body.roomid, { status: req.body.status});
    res.status(200).json({
      room,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
