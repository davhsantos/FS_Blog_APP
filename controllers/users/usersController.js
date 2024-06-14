const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

// Register
const registerCtrl = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  // Check if field is empty
  if (!fullName || !email || !password) {
    // return next(appErr("All fields are required.", 400));
    return res.render("users/register", {
      error: "All fields are required",
    });
  }
  try {
    // Check if the user is already registered
    const userFound = await User.findOne({ email });
    // Throw an error
    if (userFound) {
      // return next(appErr("User already registered."));
      return res.render("users/register", {
        error: "User already registered",
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Register user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    // Redirect user
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    res.json(error);
  }
};

const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  // Check if field is empty
  if (!email || !password) {
    // return next(appErr("All fields are required.", 400));
    return res.render("users/login", {
      error: "All fields are required",
    });
  }
  try {
    // Check if the user exists
    const userFound = await User.findOne({ email });
    if (!userFound) {
      // return next(appErr("Invalid login credentials.", 400));
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    // Check user password
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return next(appErr("Invalid login credentials.", 400));
    }
    // Save the user into session
    req.session.userAuth = userFound._id;
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    res.json(error);
  }
};

// GET/api/v1/users/:id
const userDetailsCtrl = async (req, res) => {
  try {
    // Get the user ID from params
    const userID = req.params.id;
    const user = await User.findById(userID);
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};

// GET/api/v1/users/profile/:id
const userProfileCtrl = async (req, res) => {
  try {
    // Get the login user
    const userID = req.session.userAuth;
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments");
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};

// PUT/api/v1/users/profile-photo-upload/:id
const userProfilePhotoCtrl = async (req, res, next) => {
  try {
    // Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // Check if user is found
    if (!userFound) {
      return next(appErr("User not found", 403));
    }
    // Update profile photo
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: userUpdated,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// PUT/api/v1/users/cover-photo-upload/:id
const userCoverPhotoCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User cover photo uploaded successfully",
    });
  } catch (error) {
    res.json(error);
  }
};

// PUT/api/v1/users/update-password/:id
const userPasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    // Check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      // Update user password
      await User.findByIdAndUpdate(
        req.params.id,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        data: "Password has been updated successfully",
      });
    }
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

// PUT/api/v1/users/update/:id
const userDetailsUpdateCtrl = async (req, res, next) => {
  const { fullName, email } = req.body;
  try {
    // Check if email is not taken
    const emailFound = await User.findOne({ email });
    if (emailFound) {
      return next(appErr("Email already taken.", 400));
    }
    // Update user details
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

// GET/api/v1/users/logout
const logoutCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User Logged out",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  userProfileCtrl,
  userProfilePhotoCtrl,
  userCoverPhotoCtrl,
  userPasswordCtrl,
  userDetailsUpdateCtrl,
  logoutCtrl,
};
