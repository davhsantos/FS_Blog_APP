const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
  // Check if user is authenticated
  if (req.session.userAuth) {
    next();
  } else {
    res.redirect("/api/v1/users/login");
  }
};

module.exports = protected;
