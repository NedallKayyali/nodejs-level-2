const express = require("express");
const app = express();
const mongoose = require("mongoose");
const allRoutes = require("./routes/allRoutes");
const addUserRoute = require("./routes/addUser");
app.use(express.json());
// cookies-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser())
// To Send Data To DB Use This Code With <Form action = "" method = ""> & Schema Structure
app.use(express.urlencoded({ extended: true }));

// ejs Templete engine Code
app.set("view engine", "ejs");
// Static Code File
app.use(express.static("public"));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));
//  .env
require('dotenv').config()

// Auto Reload Code
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// connect to DataBase=======
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

app.listen(3000, () => {
  console.log(`http://localhost:3000/`);
});

app.use(allRoutes);
app.use(addUserRoute);
