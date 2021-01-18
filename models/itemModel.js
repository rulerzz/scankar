const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    config: [
      {
        name: String,
        price: Number
      },
    ],
    addons: [
      {
       name: String,
       price: Number
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);