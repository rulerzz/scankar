const ResturantDetails = require('../models/resturantDetailsModel');
const Order = require('../models/orderModel');
const CustomerOrder = require('../models/customerOrderModel');
const cloudinary = require('../utils/cloudinary');
const bufferToString = require('../utils/convertBufferToStr');

// const userInput = '05:20';
// const hours = userInput.slice(0, 2);
// const minutes = userInput.slice(3);

// const date = new Date(dateString);
// date.setHours(hours, minutes);

// to fetch the number of seats
// exports.fetchAvailableSeats = async (req, res) => {
//   try {
//     // no of requested seates by customer
//     const requestedSeats = await CustomerOrder.findOne({
//       _id: req.params.id,
//     }).select('noOfSeatsRequested');
//     seatRequested = requestedSeats.noOfSeatsRequested;

//     // no of allotted seats by resturant
//     const allottedSeats = await Order.findOne({
//       _id: req.params.id,
//     }).select('noOfSeatsConfirmed');
//     seatAllotted = allottedSeats.noOfSeatsConfirmed;

//     // total no of seats in the resturant
//     const totalSeats = await ResturantDetails.findOne({
//       _id: req.params.id,
//     }).select('seats.totalNumberOfSeats');
//     totalSeats = totalSeats.seats.totalNumberOfSeats;

//     // total available seats
//     let availableSeats = totalSeats - allottedSeats;
//     const updatedSeats = await ResturantDetails.findOneAndUpdate(
//       seats.seatsAvailable,
//       availableSeats,
//       {
//         new: true,
//       }
//     );
//     res.status(200).json({
//       status: 'success',
//       data: {
//         updatedSeats,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'failed',
//       message: 'Invalid Entry',
//     });
//   }
// };

// to get all details
exports.viewAllResturantDetails = async (req, res) => {
  try {
    const details = await ResturantDetails.find();
    res.status(200).json({
      status: 'Success',
      data: {
        details,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

// to get singleresturant details
exports.viewSingleResturantDetails = async (req, res) => {
  try {
    const details = await ResturantDetails.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        details,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
// to create details

let imageContent, image_url;
exports.createResturantDetails = async (req, res) => {
  try {
    imageContent = bufferToString(req.file.originalname, req.file.buffer)
      .content;
    await cloudinary.uploader.upload(imageContent, (err, imageResponse) => {
      if (err) console.log(err);
      else {
        image_url = imageResponse.secure_url;
        console.log('log from cloudinary', image_url);
      }
    });
    // console.log(req.body);
    const dtls = req.body;
    dtls.photo = image_url;
    const newDetails = await ResturantDetails.create(dtls);
    res.status(201).json({
      status: 'Success',
      message: 'Details successfully added to DB',
      data: {
        User: newDetails,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};

// to update details
exports.updateResturantDetails = async (req, res) => {
  try {
    const details = await ResturantDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        details,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};

// delete details
exports.deleteResturantDetails = async (req, res) => {
  try {
    await ResturantDetails.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};
