const express = require("express");
const router = express.Router()
const AuthUser = require("../models/authUser");
var moment = require("moment");
const userController = require("../controllers/userController");
var {requireAuth, checkIfUser} = require("../middleware/middleware");



router.get("/user/add.html", checkIfUser, requireAuth, userController.user_add_get);

router.post("/user/add.html", checkIfUser, userController.user_add_post);

module.exports = router;