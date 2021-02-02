const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const fs = require('fs');
const path = require("path");
const https = require('https');
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
const sslserver = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);
sslserver.listen(port, () => {
  console.log('HTTPS Server on port' + port );
})

// My routes
const userRouter = require("./routes/userRouter");
const customerOrderRouter = require("./routes/customerOrderRouter");
const authRoute = require("./routes/authRoute");
const itemRoute = require("./routes/itemRoute");
const { fstat } = require("fs");
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
