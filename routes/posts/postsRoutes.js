const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const postsRoutes = express.Router();
const {
  createPostCtrl,
  listPostCtrl,
  postDetailsCtrl,
  postDeleteCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/postsController");
const protected = require("../../middlewares/protected");

// Instance of multer
const upload = multer({ storage });

// POST/api/v1/posts
postsRoutes.post("/", protected, upload.single("file"), createPostCtrl);

// GET/api/v1/posts
postsRoutes.get("/", listPostCtrl);

// GET/api/v1/posts/:id
postsRoutes.get("/:id", postDetailsCtrl);

// DELETE/api/v1/posts
postsRoutes.delete("/:id", protected, postDeleteCtrl);

// PUT/api/v1/posts
postsRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);

module.exports = postsRoutes;
