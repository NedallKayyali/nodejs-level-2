const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const AuthUser = require("../models/authUser");
const bcrypt = require("bcrypt");
// var jwt = require("jsonwebtoken");
var { requireAuth } = require("../middleware/middleware");
const { checkIfUser } = require("../middleware/middleware");
const { check, validationResult } = require("express-validator");

// router.get('*', checkIfUser);

//  level 3
const multer = require('multer')
const upload = multer({ storage: multer.diskStorage({}) });
const AuthUser = require("../models/authUser");
var jwt = require("jsonwebtoken");
// Require the Cloudinary library
const cloudinary = require('cloudinary').v2
// Configuration
cloudinary.config({
  cloud_name: 'dtspxjmtf',
  api_key: '456493975568835',
  api_secret: '432tD7TfzoaiACkjEzNi9CNYFBQ' // Click 'View API Keys' above to copy your API secret
});

router.post("/update-profile", upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  cloudinary.uploader.upload(req.file.path, async (error, result) => {
    if (result) {
       var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
      
        const avatar = await AuthUser.updateOne({ _id: decoded.id }, { profileImage: result.secure_url } )
        res.redirect("/home")
    }
    console.log(result, error);
  })
})




// Level 2
router.get("/", checkIfUser, (req, res) => {
  res.render("welcome");
});

router.get("/login", checkIfUser, (req, res) => {
  res.render("../views/auth/login.ejs");
});

router.get("/signup", checkIfUser, (req, res) => {
  res.render("../views/auth/signup.ejs");
});

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number",
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  async (req, res) => {
    try {
      // Check Validation (Email & Password)
      const objError = validationResult(req);
      if (objError.errors.length > 0) {
        return res.json({ arrValidationError: objError.errors });
      }
      // Check if the email already exist ?
      const isCurrentEmail = await AuthUser.findOne({ email: req.body.email });
      if (isCurrentEmail) {
        return res.json({ existEmail: "Email already exist" });
      }
      // When check that is no error & email is not exist ? Create new user & login
      const newUser = await AuthUser.create(req.body);
      var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({ id: newUser._id });
    } catch (error) {
      console.log(error);
      res.redirect("/views/welcome.ejs");
    }
  },
);

router.post("/login", async (req, res) => {
  // Do the email exist ?
  const loginUser = await AuthUser.findOne({ email: req.body.email });
  // if it is not exist email show message to the frontend
  if (loginUser == null) {
    res.json({ notFoundEmail: "Email not found, try to signup" });
    // if it exist make compare bettween the password in db & the password user input
  } else {
    const match = await bcrypt.compare(req.body.password, loginUser.password);
    // if the password is right
    if (match) {
      // console.log("correct email & password");
      var token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({ id: loginUser._id });
      // if the password is wrong send message to frontend
    } else {
      res.json({ passwordError: `incorrect password for ${req.body.email}` });
    }
  }
});

router.get("/signout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

// Level 1
// Get Request (Get Data From DB)
router.get("/home", checkIfUser, requireAuth, userController.user_index_get);

router.get("/view/:id", checkIfUser, requireAuth, userController.user_view_get);

router.get("/edit/:id", checkIfUser, requireAuth, userController.user_edit_get);

// Post Request (Send Data To DB)
router.post("/search", checkIfUser, userController.user_search_post);

// Delete Request (Delelte Data From DB)
router.delete("/edit/:id", checkIfUser, requireAuth, userController.user_delete);

// Update Request (Update Data In  DB)
router.put("/edit/:id", checkIfUser, userController.user_put);

module.exports = router;
