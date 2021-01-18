const Order = require('../models/orderModel');
const CustomerOrder = require('../models/customerOrderModel');
// Controllers

// // to see how many seats a customer requested
// let seatRequested;
// exports.fetchRequestedSeats = async (req, res) => {
//   try {
//     const requestedSeats = await CustomerOrder.findOne({
//       _id: req.params.id,
//     }).select('noOfSeatsRequested');
//     seatRequested = requestedSeats.noOfSeatsRequested;
//     console.log(seatRequested);
//     res.status(200).send(seatRequested);
//   } catch (err) {
//     res.status(400).json({
//       status: 'failed',
//       message: 'Invalid Entry',
//     });
//   }
// };

// // seats available after alloting latest customer
// let seatAllotted;
// exports.availableSeats = async (req, res) => {
//   try {
//     const allottedSeats = await Order.findOne({
//       _id: req.params.id,
//     }).select('noOfSeatsConfirmed');
//     seatAllotted = allottedSeats.noOfSeatsConfirmed;
//     res.status(200).send(seatAllotted);
//   } catch (err) {
//     res.status(400).json({
//       status: 'failed',
//       message: 'Invalid Entry',
//     });
//   }
// };
// to get all orders

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: 'Success',
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

// to get a single order
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Order ID',
    });
  }
};

// to create an order
// temporary
// exports.createOrder = async (req, res) => {
//   try {
//     const newOrder = await Order.create(req.body);
//     res.status(201).json({
//       status: 'Success',
//       message: 'Order successfully added to DB',
//       data: {
//         order: newOrder,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'Error',
//       err,
//     });
//   }
// };

exports.createOrder = async (order) => {
  try {
    const newOrder = {
      orderType: order.orderType,
      status: order.status,
      user: order.user,
      userName: order.userName,
      orders: order.orders,
      price: order.price,
      noOfSeatsAllotted: order.noOfSeatsRequested,
      userId:order.userId
    };
    await Order.create(newOrder);
  } catch (err) {
    console.log(err);
  }
};

// update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};

// update order process
exports.updateOrderProcess = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};
// delete order

// In future need to add
