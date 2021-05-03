const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
        type: Number,
    },
    items: {
      type: Array
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
