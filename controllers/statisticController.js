const CustomerOrder = require("../models/customerOrderModel");
const Category = require("../models/categoryModel");

exports.getStatistics = async (req, res) => {
  try {
    var today = new Date(),
    oneDay = ( 1000 * 60 * 60 * 24 ),
    thirtyDays = new Date( today.valueOf() - ( 30 * oneDay ) ),
    fifteenDays = new Date( today.valueOf() - ( 15 * oneDay ) ),
    sevenDays = new Date( today.valueOf() - ( 7 * oneDay ) );

    const data = await CustomerOrder.find({user : req.params.id});

    let grouped = await CustomerOrder.aggregate([
      { "$match": {
        "createdAt": { "$gte": thirtyDays }
      }},
      {$group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: {$sum: '$price'},
          count: {$sum: 1},
          avg: {$avg: '$price'}
      }}
  ]);

  let categories = await Category.aggregate([
    {$group: {
      _id: { user: "$user" },
        count: {$sum: 1},
    }}
]);;

    res.status(200).json({
      data,
      grouped,
      categories
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
