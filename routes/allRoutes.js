const express = require("express");
const router = express.Router();
const User = require("../models/customerSchema");
var moment = require("moment");
const userController = require("../controllers/userController");
const AuthUser = require("../models/authUser");

// Level 2
router.get("/", (req, res) => {
  res.render("welcome");
});

router.get("/login", (req, res) => {
  res.render("../views/auth/login.ejs");
});

router.get("/signup", (req, res) => {
  res.render("../views/auth/signup.ejs");
});

router.post("/signup", async(req, res) => {
  try {
    const result = await AuthUser.create(req.body);
    console.log(result)
  } catch (error) {
    console.log(error);
  }
});
// router.post("/signup", (req, res) => {
//   console.log(req.body)
//   console.log("===================================")
//   AuthUser.create(req.body)
//   .then((result) => {
//     console.log(result);
//   }).catch((error) => {
//     console.log(error);
//   })
// });



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
