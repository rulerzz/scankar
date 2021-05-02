const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room:{
        type: Number,
    },
    status: {
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
