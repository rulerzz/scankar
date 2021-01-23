const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const User = require('./userModels');

const orderSchema = new mongoose.Schema(
  {
    contents: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        quantity: Number,
      },
    ],
    palced_time: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
