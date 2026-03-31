const User = require("../models/customerSchema");
var moment = require("moment");

// Get Request
const user_index_get = (req, res) => {
  User.find()
    .then((result) => {
      res.render("index", { array: result, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

const user_view_get = (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

const user_edit_get = (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Post Request
const user_search_post = (req, res) => {
  const searchText = req.body.searchText.trim();
  User.find({ $or: [{ firstName: searchText }, { lastName: searchText }] })
    .then((result) => {
      res.render("user/search", { array: result, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Delete Request
const user_delete = (req, res) => {
  User.deleteOne({
    _id: req.params.id,
  })
    .then((result) => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

// Put Request
const user_put = (req, res) => {
  // console.log(req.body); //And Then Click On Update Button In Edit.ejs
  User.updateOne({ _id: req.params.id }, req.body)
    .then(() => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

const user_add_get = (req, res) => {
  res.render("user/add");
}

const user_add_post = (req, res) => {
  User.create(req.body)
    .then(() => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  user_index_get,
  user_view_get,
  user_edit_get,
  user_search_post,
  user_delete,
  user_put,
  user_add_get,
  user_add_post
};
