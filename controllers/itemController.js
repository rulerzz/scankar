const Item = require("./../models/itemModel");

exports.item = async (req, res) => {
  try {
    let item = {};
    await Item.find({ _id: req.params.id }, function (err, result) {
      if (err) throw err;
      item = result;
    });
    res.status(200).json({
      status: "Success",
      data: item,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
