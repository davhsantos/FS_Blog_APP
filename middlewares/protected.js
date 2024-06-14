const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
  // Check if user is authenticated
  if (req.session.userAuth) {
    next();
  } else {
    next(appErr("User unauthorized, please login"));
  }
};

module.exports = protected;
