const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
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
    categoryimg: {
      type: String,
      default: "https://res.cloudinary.com/scankar/image/upload/v1599616428/jqm19kwhxjhn39shwguq.jpg",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
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

module.exports = mongoose.model('Product', productSchema);
