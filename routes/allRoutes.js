const express = require("express");
const router = express.Router()
const User = require("../models/customerSchema");
var moment = require("moment");
const userController = require("../controllers/userController");

// Level 2
router.get("/", (req, res) => {
  res.render("welcome")
});

router.get("/login", (req, res) => {
  res.render("../views/auth/login.ejs")
});

router.get("/signup", (req, res) => {
  res.render("../views/auth/signup.ejs")
});

// Level 1
// Get Request (Get Data From DB)
router.get("/home", userController.user_index_get);

router.get("/view/:id", userController.user_view_get);

router.get("/edit/:id", userController.user_edit_get);

// Post Request (Send Data To DB)
router.post("/search", userController.user_search_post);

// Delete Request (Delelte Data From DB)
router.delete("/edit/:id", userController.user_delete);

// Update Request (Update Data In  DB)
router.put("/edit/:id", userController.user_put);

module.exports = router;
