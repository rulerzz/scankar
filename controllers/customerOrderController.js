const CustomerOrder = require('../models/customerOrderModel');
const order = require('./orderController');
const Admin=require('../models/userModels');
const Product=require('../models/productModel')
const { subscription } = require('./userController');
const webPush = require('web-push');
const User = require("./../models/userModels");

webPush.setVapidDetails('mailto:test@example.com',  process.env.Public_Key, process.env.Private_Key);
// Controllers
// to get all order
exports.getAllOrders = async (req, res) => {
  try {
    let orders;
    let user = await User.findById(req.user._id);
    if(user.role == 'superadmin'){
      orders = await CustomerOrder.find()
      .skip(Number(req.query.offset))
      .limit(10)
      .sort({ palced_time: "desc" });
    }
    else{
      orders = await CustomerOrder.find({ userId: req.user._id })
      .skip(Number(req.query.offset))
      .limit(10)
      .sort({ palced_time: "desc" });
    }
   
    // console.log("customer order", orders)
    const count = await CustomerOrder.countDocuments();
    res.status(200).json({
      status: 'Success',
      results: orders.length,
      data: {
        orders,
      },
      count : count
    });
  } catch (err) {
   res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
exports.getnewOrders = async (req, res) => {
  try {
    console.log("userIddd", req.user._id)
    const orders = await CustomerOrder.find({userId:req.user._id});
    console.log("customer order" , orders)
    res.status(200).json({
      status: 'Success',
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
// to get a single order
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Order ID',
    });
  }
};

// to create an order
exports.createOrder = async (req, res) => {
  try {
      // console.log("req.io",req.io);
     
      // console.log("newOrder",req.body);
     let price=req.body.price;
     let isCashOnDelivery =req.body.isCashOnDelivery;
     let isPaymentReceived=req.body.isPaymentReceived;
     let isDelivered=req.body.isDelivered;
     let noOfSeatsRequested=req.body.noOfSeatsRequested;
     let userName=req.body.userName;
     let orderType=req.body.orderType;
     let userId=req.body.userId;
     let orders=req.body.orders;
     let instruction = req.body.instruction;
     let username;
    //  console.log("orders",orders);
     let arr=(Object.keys(orders));
     let quantity=(Object.values(orders))
    //  console.log(arr,quantity);
     let len=arr.length
  let cat=[];
  let v={};
  for(i=0;i<len;i++){
    let qua=quantity[i]
    // console.log(qua);
    Product.findById(arr[i]).then((s)=>{
      if(s){
        
        v={
          "item":s.name,
          "quantity":qua
        }
        cat.push(v);
        // console.log(cat);
        orders=cat;
        // console.log("orders in cat ",orders);
      }
     
    })

  }
  setTimeout(async function(){  

  let  subs;
  const newOrder = await CustomerOrder.create({
    userName:userName,
    price:price,
    isCashOnDelivery:isCashOnDelivery,
    isPaymentReceived:isPaymentReceived,
    isDelivered:isDelivered,
    noOfSeatsRequested:noOfSeatsRequested,
    orderType:orderType,
    userId:userId,
    orders:orders,
    instruction:instruction
}).then((s,err)=>{
  if(err){console.log(err)}
  if (s){
     username=s.userName;
   console.log("inside s",s)
   req.io.emit('testerEvent',{s})
  //   req.io.on('connection', function(socket) {
        
  //     console.log('A user ssconnected');
   
  //     //Send a message when 
      
  //        //Sending an object when emmiting an event
  //        socket.emit('testerEvent', { s});
  //     // socket.conn.close();
   
  //     socket.on('disconnect', function () {
  //        console.log('A user disconnected');
  //     });
  //  });
  }

 
})
  // console.log("newOrder.userId",newOrder);
  //   console.log("userid",newOrder.userId);
    
    // order.createOrder(newOrder);

    await  Admin.findOne({_id:userId},function(err,data){
      if(err){console.error(err)}
      else{
        console.log("data",data);
        subs =data.subscriptions;
        // console.log(subs);

        const payload = JSON.stringify({
          title: 'Order is placed',
          body: `New order by ${username}`
        });

        webPush.sendNotification(subs, payload)
        .then(result => console.log("webpushthen"))
        .catch(e => console.error(e))

      }
    })
    res.status(201).json({
      status: 'Success',
      message: 'Order successfully placed',
      data: {
        order: newOrder,
      },
    });

},1200);
} catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};

// update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await CustomerOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      err,
    });
  }
};

// In future need to add
