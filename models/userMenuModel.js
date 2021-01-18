const mongoose = require('mongoose');

const userMenuSchema = new mongoose.Schema(
  {
    resturant_id: {
      type: String,
      required: true,
    },
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
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      maxlength: 32,
      required: true,
      trim: true,
    },
    categoryImg:{
      type: String,
      default:"https://res.cloudinary.com/dvetb04ra/image/upload/v1595283891/qqmliaurpz3dk9qsezcn.jpg"
    },
    photo: {
      type: String,
    },
    options: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: 'Available',
      enum: ['Available', 'Unavailable'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserMenu', userMenuSchema);
