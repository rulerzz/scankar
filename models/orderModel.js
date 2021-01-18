const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const User = require('./userModels');

const orderSchema = new mongoose.Schema(
  {
    // transaction_id: {},
    // transaction_status: String,
    userName: {
      type: String,
      required: true,
    },
    isCashOnDelivery: {
      type: Boolean,
    },
    orders: [
      {
        item: String,
        quantity: Number,
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    orderType: {
      type: String,
      default: 'Take Home',
      enum: ['Dine In', 'Take Home'],
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
      default: 'Pending',
      enum: [
        'Pending',
        'Placed',
        'Recieved',
        'Processing',
        'Delivered',
        'Cancelled',
      ],
    },
  
    process: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Accepted', 'Delivered'],
    },
    noOfSeatsAllotted: {
      type: Number,
    },
    table_no: {
      type: Number,
    },
    user: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
