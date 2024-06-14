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

// Login template
userRoutes.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});

// Register template
userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

// Profile template
userRoutes.get("/profile", (req, res) => {
  res.render("users/profile", {
    error: "",
  });
});

// Profile photo upload template
userRoutes.get("/profile-photo-upload", (req, res) => {
  res.render("users/uploadProfilePhoto");
});

// Cover photo upload template
userRoutes.get("/cover-photo-upload", (req, res) => {
  res.render("users/uploadCoverPhoto");
});

// Update user template
userRoutes.get("/update", (req, res) => {
  res.render("users/update");
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

// PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload/:id", userCoverPhotoCtrl);

// PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/:id", userPasswordCtrl);

// PUT/api/v1/users/update/:id
userRoutes.put("/update/:id", userDetailsUpdateCtrl);

// GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

// GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

module.exports = userRoutes;
