const User = require("./../models/userModels");
const Category = require("./../models/categoryModel");
const Item = require("./../models/itemModel");
const bufferToString = require("../utils/convertBufferToStr");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .skip(Number(req.query.offset))
      .limit(10)
      .sort({ createdAt: "desc" });
    const count = await User.countDocuments();
    res.status(200).json({
      status: "Success",
      results: users.length,
      count: count,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.getAllUsersData = async (req, res) => {
  try {
    const users = await User.find()
      .select({ firstName: 1, lastName: 1, _id: 1 })
      .sort({ firstName: "asc" });
    res.status(200).json({
      status: "Success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.uploadpfp = async (req, res) => {
  try {
    let imageContent = bufferToString(req.file.originalname, req.file.buffer)
      .content;
    await cloudinary.uploader.upload(imageContent, (err, imageResponse) => {
      if (err) throw err;
      else {
        image_url = imageResponse.secure_url;
        User.updateOne(
          { _id: req.params.id },
          {
            photo: image_url,
          },
          function (err, doc) {
            if (err) {
              throw err;
            } else {
              res.status(200).json({
                status: "Success",
                data: {
                  url: image_url,
                },
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to upload image!",
    });
  }
};
// to get a single user
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: "Invalid ID",
    });
  }
};
exports.createCategory = async (req, res) => {
  try {
    let imageContent = bufferToString(req.file.originalname, req.file.buffer)
      .content;
    await cloudinary.uploader.upload(imageContent, (err, imageResponse) => {
      if (err) throw err;
      else {
        image_url = imageResponse.secure_url;
        let data = {
          user: req.params.id,
          image: image_url,
          name: req.params.name,
          description: req.params.description,
          cuisine: req.params.cuisine,
        };
        Category.create(data).then((newCategory, err) => {
          if (err) {
            throw err;
          } else {
            User.findOneAndUpdate(
              { _id: req.params.id },
              { $push: { categories: newCategory._id } },
              { new: true, useFindAndModify: false },
              function (err, doc) {
                if (err) {
                  throw err;
                } else {
                  res.status(200).json({
                    status: "Success",
                  });
                }
              }
            );
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    Category.findByIdAndDelete(req.params.categoryid, function (err, doc) {
      if (err) {
        throw err;
      } else {
        User.updateOne(
          { _id: req.params.userid },
          { $pull: { categories: req.params.categoryid } },
          function (err, doc) {
            if (err) {
              throw err;
            } else {
              res.status(200).json({
                status: "Success",
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: JSON.stringify(err.message),
    });
  }
};
exports.setCharge = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { servicecharge: req.body.charge },
      function (err, doc) {
        if (err) {
          throw err;
        } else {
          res.status(200).json({
            status: "Success",
          });
        }
      }
    );
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.setGst = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { gst: req.body.charge },
      function (err, doc) {
        if (err) {
          throw err;
        } else {
          res.status(200).json({
            status: "Success",
          });
        }
      }
    );
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.getalldata = async (req, res) => {
  try {
    const user = await User.find({
      _id: req.params.id,
    }).populate({
      path: "categories",
      populate: {
        path: "items",
      },
    });
    // console.log("-----userMenu-------",user)
    res.status(200).json({
      status: "Success",
      data: {
        user: user
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: "Invalid ID",
    });
  }
};
exports.findCategoryOrItems = async (req, res) => {
  try {
    const user = await User.find({
      _id: req.params.id,
    }).populate({
      path: "categories",
      populate: {
        path: "items",
      },
    });
    // console.log("-----userMenu-------",user)
    res.status(200).json({
      status: "Success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: "Invalid ID",
    });
  }
};
exports.createItem = async (req, res) => {
  try {
    let imageContent = bufferToString(req.file.originalname, req.file.buffer)
      .content;
    cloudinary.uploader.upload(imageContent, (err, imageResponse) => {
      if (err) throw err;
      else {
        image_url = imageResponse.secure_url;
        let data = {
          user: req.body.id,
          name: req.body.name,
          price: req.body.price,
          category: mongoose.Types.ObjectId(req.body.category),
          image: image_url,
          config: JSON.parse(req.body.config),
          addons: JSON.parse(req.body.addon),
        };
        Item.create(data).then((newItem, err) => {
          if (err) {
            throw err;
          } else {
            Category.findOneAndUpdate(
              { _id: req.body.category },
              { $push: { items: newItem._id } },
              { new: true, useFindAndModify: false },
              function (err, doc) {
                if (err) {
                  throw err;
                } else {
                  res.status(200).json({
                    status: "Success",
                  });
                }
              }
            );
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.updateItem = async (req, res) => {
  try {
    let data = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      config: req.body.config,
      addons: req.body.addons,
    };
    await Item.findOneAndUpdate(
      { _id: req.body._id },
      data,
      {useFindAndModify: false},
      function (err, doc) {
        if (err) {
          res.status(400).json("Error while updating!");
        }
        //handle it
        res.status(200).json({
          status: "successfully updated!",
          item: doc,
        });
      }
    );
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.updateItemWithPic = async (req, res) => {
  try {
    let imageContent = bufferToString(req.file.originalname, req.file.buffer)
      .content;
    cloudinary.uploader.upload(imageContent, (err, imageResponse) => {
      if (err) throw err;
      else {
        image_url = imageResponse.secure_url;
        console.log(req.body);
        let data = {
          name: req.body.name,
          price: req.body.price,
          category: req.body.category,
          config: JSON.parse(req.body.config),
          addons: JSON.parse(req.body.addons),
          image: image_url,
        };
        Item.findOneAndUpdate(
          { _id: req.body._id },
          data,
          { useFindAndModify: false },
          function (err, doc) {
            if (err) {
              res.status(400).json("Error while updating!");
            }
            //handle it
            res.status(200).json({
              status: "successfully updated!",
              item: doc,
            });
          }
        );
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    Item.deleteOne({ _id: req.params.id }, function (err) {
      if (err) return handleError(err);
      // deleted at most one document
      else {
        Category.updateOne(
          { _id: req.params.categoryid },
          { $pull: { items: req.params.id } },
          function (err, doc) {
            if (err) {
              throw err;
            } else {
              res.status(200).json({
                status: "Success",
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.getSingleUsercategory = async (req, res) => {
  console.log("---from singleuserCategory----");

  try {
    const user = await User.findById(req.params.id).populate("menu");
    // console.log("-----userMenu-------",user.menu);
    let ul = user.menu.length;
    let cat = [];
    for (i = 0; i < ul; i++) {
      console.log("for", i);
      let v = {
        category: user.menu[i]["category"],
        " categoryImage": user.menu[i]["categoryImage"],
      };
      cat.push(v);
      // console.log(cat);
    }

    res.status(200).json({
      status: "Success",
      data: {
        cat,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getSingleUsercategoryitm = async (req, res) => {
  console.log("---from singleuserCategory----");

  try {
    const user = await User.findById(req.params.id).populate("menu");
    // console.log("-----userMenu-------",user.menu);
    let ul = user.menu.length;
    let cat = [];
    for (i = 0; i < ul; i++) {
      // console.log("for",i);
      let category = user.menu[i]["category"];
      let food = req.params.name.toUpperCase();
      // console.log("category",category);
      // console.log("food,",food);
      let n = food.localeCompare(category);
      // console.log(n);
      if (n == 0) {
        console.log("Entered in if");
        let v = {
          _id: user.menu[i]["_id"],
          status: user.menu[i]["status"],
          name: user.menu[i]["name"],
          price: user.menu[i]["price"],
          photo: user.menu[i]["photo"],
        };
        cat.push(v);
        // console.log(cat);
      }
    }

    res.status(200).json({
      status: "Success",
      data: {
        cat,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

// to create an user
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "Success",
      message: "User successfully added to DB",
      data: {
        User: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};

//saving userid with subscription object

// to update an user
exports.updateUser = async (req, res) => {
  try {
    if (req.body.Subscription === subscriptions.endpoint) {
      console.log("true");
      await User.updateOne(
        { _id: req.body.userId },
        {
          subscriptions: subscriptions,
        },
        function (err, doc) {
          if (err) {
            res.status(400).json("err whiling updating");
          }
          //handle it

          res.status(200).json({
            status: "subscription saved on user",
            data: {
              doc,
            },
          });
        }
      );
    } else {
      console.log("not in if");
    }
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};
exports.update = async (req, res) => {
  try {
    if (req.body._id != undefined || req.body._id != null) {
      await User.updateOne(
        { _id: req.body._id },
        req.body,
        function (err, doc) {
          if (err) {
            res.status(400).json("Error while updating!");
          }
          //handle it

          res.status(200).json({
            status: "successfully updated!",
          });
        }
      );
    } else {
      console.log("Id not defined");
    }
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};
// to delete an user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      err,
    });
  }
};
