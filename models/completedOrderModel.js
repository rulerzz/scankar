const mongoose = require("mongoose");

const completedOrderSchema = new mongoose.Schema(
  {
    discount: {
      type: Number,
      required: true,
    },
    discountApplied: {
      type: Boolean,
      required: true,
    },
    orders : [
        
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("completedOrder", completedOrderSchema);
