const express = require("express");
const router = express.Router()
const User = require("../models/customerSchema");
var moment = require("moment");
const userController = require("../controllers/userController");
var requireAuth = require("../middleware/middleware");



router.get("/user/add.html", requireAuth, userController.user_add_get);

router.post("/user/add.html", userController.user_add_post);

module.exports = router;