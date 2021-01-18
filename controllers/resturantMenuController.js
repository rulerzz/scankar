const Product = require('../models/productModel');
const cloudinary = require('../utils/cloudinary');
const bufferToString = require('../utils/convertBufferToStr');
const readXlsxFile = require('read-excel-file/node');
const path = require('path');

exports.getAllItemsOfResturant = (req, res) => {
  let items;
  Product.find({ resturant_id: req.params.id })
    .then((result) => {
      items = result;
      res.status(200).send(items);
    })
    .catch((err) => console.log(err));
};

exports.getSingleItemOfResturant = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.status(200).json({
      status: 'Success',
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
};

exports.updateItemOfResturant = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};

// to delete an product
exports.deleteItemOfResturant = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
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

exports.createBulkItemsOfResturant = async (req, res) => {
  try {
    

    let allProducts = [];

    req.body.products.forEach((row) => {
      let product = {
        resturant_id: row.resturant_id,
        name: row.name,
        rating: row.rating,
        price: row.price,
        category: row.category,
        photo: row.photo,
        options: row.options,
        status: row.status,
      };

      allProducts.push(product);
    });
    console.log(allProducts);
    Product.insertMany(allProducts)
      .then(() => {
        res.status(200).send({
          message: 'Uploaded successfully',
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: 'Fail to import data into database!',
          error: error.message,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Could not upload the file: ' + req.file.originalname,
    });
  }
};

let imageContent, image_url;
exports.createItemOfResturant = async (req, res) => {
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
    const prod = req.body;
    prod.photo = image_url;
    // prod.resturant_id = req.client_id;
    console.log(prod);
    const newProduct = await Product.create(prod);
    res.status(201).json({
      status: 'Success',
      message: 'Product successfully added to DB',
      data: {
        User: newProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};
