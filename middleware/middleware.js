var jwt = require("jsonwebtoken");
const AuthUser = require("../models/authUser");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.jwt_secret_key, (error) => {
      if (error) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkIfUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.jwt_secret_key, async (error, decoded) => {
      if (error) {
        res.locals.user = null;
        next();
      } else {
        const currentUser = await AuthUser.findById(decoded.id);
        res.locals.user = currentUser;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkIfUser };
