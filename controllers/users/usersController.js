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
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
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
    // Find the user
    const user = await User.findById(userID);
    res.render("users/updateProfile", {
      user,
      error: "",
    });
  } catch (error) {
    return res.render("users/updateProfile", {
      error: error.message,
    });
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
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};

// PUT/api/v1/users/profile-photo-upload/:id
const userProfilePhotoCtrl = async (req, res, next) => {
  try {
    // check if file exists
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please provide a file to upload",
      });
    }
    // Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // Check if user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
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
    // Redirect to main profile page
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

// PUT/api/v1/users/cover-photo-upload/:id
const userCoverPhotoCtrl = async (req, res, next) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.render("users/uploadCoverPhoto", {
        error: "Please provide a file to upload",
      });
    }
    // Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // Check if user is found
    if (!userFound) {
      return res.render("users/uploadCoverPhoto", {
        error: "User not found",
      });
    }
    // Update cover photo
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
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
      // Get userID
      const userID = req.session.userAuth;
      // Find the user to be updated
      const userFound = await User.findById(userID);
      // Check if user is found
      if (!userFound) {
        return res.render("users/updatePassword", {
          error: "User not found",
        });
      }
      // Update user password
      await User.findByIdAndUpdate(
        userID,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      res.redirect("/api/v1/users/profile");
    } else {
      return res.render("users/updatePassword", {
        error: "All fields are required",
      });
    }
  } catch (error) {
    return res.render("users/updatePassword", {
      error: error.message,
    });
  }
};

// PUT/api/v1/users/update/:id
const userDetailsUpdateCtrl = async (req, res, next) => {
  const { fullName, email } = req.body;
  try {
    // Check if fields are empty
    if (!fullName || !email) {
      return res.render("users/updateProfile", {
        error: "All fields are required",
      });
    }
    // Check if email is not taken
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.render("users/updateProfile", {
        user: "",
        error: "Email is already taken",
      });
    }
    // Find the user to be updated
    const userID = req.session.userAuth;
    // Update user details
    const userUpdated = await User.findByIdAndUpdate(
      userID,
      {
        fullName,
        email,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/updateProfile", {
      error: error.message,
    });
  }
};

// GET/api/v1/users/logout
const logoutCtrl = async (req, res) => {
  // Destroy session
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
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
