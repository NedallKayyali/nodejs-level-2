const AuthUser = require("../models/authUser");
var moment = require("moment");
var jwt = require("jsonwebtoken");

// Get Request
//  /home
//   done
const user_index_get = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  AuthUser.findById(decoded.id)
    .then((result) => {
      res.render("index", { array: result.customerInfo, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

//  add user
//  done
const user_add_post = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  AuthUser.updateOne({ _id: decoded.id }, { $push: { customerInfo: req.body } })
    .then(() => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

// Delete Request
//  done
const user_delete = (req, res) => {
  AuthUser.updateOne(
    { "customerInfo._id": req.params.id },
    { $pull: { customerInfo: { _id: req.params.id } } },
  )
    .then((result) => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

//  /view/:id
//  done
const user_view_get = (req, res) => {
  AuthUser.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      res.render("user/view", { obj: clickedObject, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

//  /edit/:id
//  done
const user_edit_get = (req, res) => {
  AuthUser.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      res.render("user/edit", { obj: clickedObject, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Put Request
//  /edit/:id
//  done
const user_put = (req, res) => {
  AuthUser.updateOne(
    { "customerInfo._id": req.params.id },
    { "customerInfo.$": req.body },
  )
    .then(() => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

// Post Request
//  done
const user_search_post = (req, res) => {
  const searchText = req.body.searchText.trim();
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  AuthUser.findOne({ _id: decoded.id })
    .then((result) => {
      const searchCustomers = result.customerInfo.filter((item) => {
        return item.firstName == searchText
      })
      res.render("user/search", { array: searchCustomers, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

const user_add_get = (req, res) => {
  res.render("user/add");
};

module.exports = {
  user_index_get,
  user_view_get,
  user_edit_get,
  user_search_post,
  user_delete,
  user_put,
  user_add_get,
  user_add_post,
};
