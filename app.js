const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require('fs');
const https = require('https');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 5000;

// DB Connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED SUCCESSFULLY AT " + process.env.DATABASE);
    console.log("DB USER " + process.env.DATABASE_USERNAME);
    console.log("DB PASS " + process.env.DATABASE_PASSWORD);
  })
  .catch(() => {
    console.log("PROBLEM CONNECTING DB");
  });
/*const server = app.listen(port, () => {
  console.log(`Port is running at ${port}`);
});*/
var privateKey = fs.readFileSync("key.key");
var certificate = fs.readFileSync("server_scankar_com.crt");

const httpOptions = {
  key : privateKey,
  cert : certificate
};

var server = https.createServer(httpOptions).listen(port, () => {
  console.log(`HTTPS Port is running at ${port}`);
});

const io = require("socket.io")(server);
io.on("connection", function (socket) {
  console.log("Socket established with id: " + socket.id);

  socket.on("disconnect", function () {
    console.log("Socket disconnected: " + socket.id);
  });
});
module.exports = io;

// My routes
const userRouter = require("./routes/userRouter");
const customerOrderRouter = require("./routes/customerOrderRouter");
const authRoute = require("./routes/authRoute");
const itemRoute = require("./routes/itemRoute");
// const logInRoute = require('./routes/logInRoute');

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cookieParser());
app.use(express.json());

// middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/customer-order", customerOrderRouter);
app.use("/api/v1/", authRoute);
app.use("/api/v1/item", itemRoute);

// server
