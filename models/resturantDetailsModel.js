const mongoose = require('mongoose');

const returantDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 32,
      required: true,
      trim: true,
      unique: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    password: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      maxlength: 32,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
    },
    seats: {
      totalNumberOfSeats: Number,
      seatsAvailable: Number,
    },
    timings: {
      opening: String,
      closing: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResturantDetails', returantDetailsSchema);
