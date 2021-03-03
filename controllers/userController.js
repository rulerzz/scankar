const User = require("./../models/userModels");
const CustomerOrder = require('./../models/customerOrderModel');
const Category = require("./../models/categoryModel");
const Item = require("./../models/itemModel");
const bufferToString = require("../utils/convertBufferToStr");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const csvtojson = require("csvtojson");
const { create } = require("./../models/userModels");
var io = require("../app");

let emitcallwaiterping = function (socketid, tableNo) {
  io.to(socketid).emit("callwaiterping", tableNo);
  console.log("Emitting call waiter ping for socketid : "+ socketid);
};

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
exports.updateCategory = async (req, res) => {
  try {
    let categori = JSON.parse(req.body.category);
    if (req.body.photo != "undefined") {
      // UPLOAD PIC AND UPDATE
      let imageContent = bufferToString(req.file.originalname, req.file.buffer)
        .content;
      await cloudinary.uploader.upload(imageContent, (err, imageResponse) => {
        if (err) throw err;
        else {
          image_url = imageResponse.secure_url;
          categori.image = image_url;
          Category.findOneAndUpdate(
            { _id: categori._id },
            categori,
            { useFindAndModify: false },
            function (err, doc) {
              if (err) {
                throw err;
              } else {
                res.status(200).json({
                  status: "Success",
                  category: doc,
                });
              }
            }
          );
        }
      });
    } else {
      // DONT UPDATE PIC
      Category.findByIdAndUpdate(
        categori._id,
        categori,
        { useFindAndModify: false },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            res.status(200).json({
              status: "Success",
              category: doc,
            });
          }
        }
      );
    }
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
          description: req.body.description,
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
      description: req.body.description,
      category: req.body.category,
      config: req.body.config,
      addons: req.body.addons,
    };
    await Item.findOneAndUpdate(
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
          description: req.body.description,
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
    if(req.body.configuration !== undefined && req.body.configuration.length > 0){
      req.body.configuration = JSON.parse(req.body.configuration)
    }
    if (req.body._id != undefined || req.body._id != null) {
      await User.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true, useFindAndModify: false },
        function (err, doc) {
          if (err) {
            console.log(err)
            res.status(400).json({
              err : err.message
            });
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
    console.log(err)
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
exports.bulkUpload = async (req, res) => {
  try {
    let items = [];
    let data = await csvstringparse(req.file.buffer.toString());
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] !== "") {
        console.log("Is a product " + data[i][1]);
        let category = await findCategory(data[i][0], req.params.id);
        if (category.length == 0) {
          console.log("Category not found creating it");
          // No such category so create it
          let response = await createCategoryB(
            req.params.id,
            data[i][0],
            "",
            ""
          );
          let check = await checkitem(data[i][1],
              req.params.id);
          if (!check) {
            let result = await createItemAndUpdateCategory(
              {
                name: data[i][1],
                user: req.params.id,
                price: data[i][2],
                category: response._id,
                description: data[i][3],
              },
              response
            );
            console.log(result);
          } else {
            console.log("Skipping already exist");
          }
        } else {
          console.log("Category " + category[0].name + "found creating item");
          // Already category exist for user
           let check = await checkitem(data[i][1], req.params.id);
           if (!check) {
              let result = await createItemAndUpdateCategory(
                {
                  name: data[i][1],
                  user: req.params.id,
                  price: data[i][2],
                  category: category[0]._id,
                  description: data[i][3],
                },
                category[0]
              );
              console.log(result);
           }
           else{
             console.log("Skipping already exist");
           }
        }
      } else {
        console.log("Is a configuration");
      }
    }
    res.status(200).send({
      message: "Processing file: " + req.file.originalname,
    });
  } catch (error) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

async function csvstringparse(csvStr) {
  const csv = require("csvtojson");
  return new Promise(function (resolve, reject) {
    csv({
      noheader: true,
      output: "csv",
    })
      .fromString(csvStr)
      .then((csvRow) => {
        resolve(csvRow);
      });
  });
}
async function findCategory(name, user) {
  return new Promise(function (resolve, reject) {
    Category.find({ name: name, user: user }, function (err, doc) {
      resolve(doc);
    });
  });
}
async function createCategoryB(user, name, description, cuisine) {
  return new Promise(function (resolve, reject) {
    let data = {
      user: user,
      name: name,
      description: description,
      cuisine: cuisine,
    };
    Category.create(data).then((newCategory, err) => {
      if (err) {
        resolve(false);
      } else {
        User.findOneAndUpdate(
          { _id: user },
          { $push: { categories: newCategory._id } },
          { new: true, useFindAndModify: false },
          function (err, doc) {
            if (err) {
              resolve(false);
            } else {
              resolve(newCategory);
            }
          }
        );
      }
    });
  });
}
async function createItemAndUpdateCategory(item, category) {
  return new Promise(function (resolve, reject) {
    Item.create(item).then((newItem, err) => {
      if (err) {
        resolve(false);
      } else {
        Category.findOneAndUpdate(
          { _id: category._id },
          { $push: { items: newItem._id } },
          { new: true, useFindAndModify: false },
          function (err, doc) {
            if (err) {
              resolve(false);
            } else {
              resolve(true);
            }
          }
        );
      }
    });
  });
}
async function checkitem(name, user) {
  return new Promise(function (resolve, reject) {
    Item.find(
      {
        name: name,
        user: user,
      },
      function (err, res) {
        if (err) {
          resolve(false);
        } else {
          if(res.length > 0)
          resolve(true);
          else
          resolve(false);
        }
      }
    );
  });
};
exports.setsocketid = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.userid },
      { socketid : req.params.socketid },
      { new: true, useFindAndModify: false },
      function (err, doc) {
        res.status(200).json({
          message : "socket updated!"
        });
      }
    );
  } catch (err) {
    res.status(200).json({message : "socket could not be updated!"});
  }
};
exports.sendping = async (req, res) => {
  try {
    User.findById(req.params.id)
      .select("socketid")
      .then((user) => {
        emitcallwaiterping(user.socketid, req.params.tableNo);
        res.status(200).json({ message: "socket pinged!" });
      });
  } catch (err) {
    res.status(200).json({ message: "socket could not be updated!" });
  }
};
exports.searchordersforuser = async (req, res) => {
  let orders = await CustomerOrder.find({ userId : req.params.id }).populate('user');
  res.status(200).json({
    orders: orders,
  });
};