const express = require("express");
const commentsRoutes = express.Router();
const {
  createCommentCtrl,
  commentDetailsCtrl,
  commentDeleteCtrl,
  commentUpdateCtrl,
} = require("../../controllers/comments/commentController");
const protected = require("../../middlewares/protected");
// POST/api/v1/comments
commentsRoutes.post("/:id", protected, createCommentCtrl);

// GET/api/v1/comments/:id
commentsRoutes.get("/:id", commentDetailsCtrl);

// DELETE/api/v1/comments
commentsRoutes.delete("/:id", protected, commentDeleteCtrl);

// PUT/api/v1/comments
commentsRoutes.put("/:id", protected, commentUpdateCtrl);

module.exports = commentsRoutes;
