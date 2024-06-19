const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  userProfileCtrl,
  userProfilePhotoCtrl,
  userCoverPhotoCtrl,
  userPasswordCtrl,
  userDetailsUpdateCtrl,
  logoutCtrl,
} = require("../../controllers/users/usersController");
const protected = require("../../middlewares/protected");
const userRoutes = express.Router();

// Instance of multer
const upload = multer({ storage: storage });

// Rendering forms

// Login form
userRoutes.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});

// Register form
userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

// Profile photo upload form
userRoutes.get("/profile-photo-upload", (req, res) => {
  res.render("users/uploadProfilePhoto", {
    error: "",
  });
});

// Cover photo upload form
userRoutes.get("/cover-photo-upload", (req, res) => {
  res.render("users/uploadCoverPhoto", { error: "" });
});

// Update user details form
userRoutes.get("/update", (req, res) => {
  res.render("users/updateProfile", { user: req.session.userAuth, error: "" });
});

// Update user password form
userRoutes.get("/update-password", (req, res) => {
  res.render("users/updatePassword", { error: "" });
});

// Register
userRoutes.post("/register", registerCtrl);

userRoutes.post("/login", loginCtrl);

// GET/api/v1/users/profile
userRoutes.get("/profile", protected, userProfileCtrl);

// PUT/api/v1/users/profile-photo-upload/
userRoutes.put(
  "/profile-photo-upload",
  protected,
  upload.single("profile"),
  userProfilePhotoCtrl
);

// PUT/api/v1/users/cover-photo-upload/
userRoutes.put(
  "/cover-photo-upload/",
  protected,
  upload.single("cover"),
  userCoverPhotoCtrl
);

// PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password", userPasswordCtrl);

// PUT/api/v1/users/update/:id
userRoutes.put("/update", userDetailsUpdateCtrl);

// GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

// GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

module.exports = userRoutes;
