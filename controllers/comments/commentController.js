const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const Comment = require("../../model/comment/Comment");
const appErr = require("../../utils/appErr");

// POST/api/v1/comments
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // Find the post
    const postFound = await Post.findById(req.params.id);
    // Check if the post exists
    if (!postFound) {
      return next(appErr("Post not found.", 404));
    }
    // Get the userID
    const userID = req.session.userAuth;
    // Create a new comment
    const newComment = await Comment.create({
      user: userID,
      message,
    });
    // Add the comment to the post
    postFound.comments.push(newComment.id);
    // Save the post
    await postFound.save({ validateBeforeSave: false });
    // Find the user
    const userFound = await User.findById(userID);
    // Push the comment to user
    userFound.comments.push(newComment._id);
    // Save the user
    await userFound.save({ validateBeforeSave: false });
    // Send the response
    res.json({
      status: "success",
      user: newComment,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// GET/api/v1/comments/:id
const commentDetailsCtrl = async (req, res, next) => {
  try {
    const commentFound = await Comment.findById(req.params.id);
    if (!commentFound) {
      return next(appErr("Comment not found.", 404));
    }
    res.json({
      status: "success",
      data: commentFound,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// DELETE/api/v1/comments
const commentDeleteCtrl = async (req, res, next) => {
  try {
    // Get the user id
    const userID = req.session.userAuth;
    // Find the user
    const userFound = await User.findById(userID);
    // Find the post
    const commentFound = await Comment.findById(req.params.id);
    // Check if the post exists
    if (!commentFound) {
      return next(appErr("Comment not found.", 404));
    }
    // Check if the post belongs to the user
    if (commentFound.user.toString() !== userID.toString()) {
      return next(
        appErr("You are not authorized to delete this comment.", 401)
      );
    }
    // Delete post
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      user: "Comment deleted successfully",
    });
  } catch (error) {
    next(appErr(error));
  }
};

// PUT/api/v1/comments
const commentUpdateCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // Get the user id
    const userID = req.session.userAuth;
    // Find the post
    const commentFound = await Comment.findById(req.params.id);
    // Check if the post exists
    if (!commentFound) {
      return next(appErr("Comment not found.", 404));
    }
    // Check if the post belongs to the user
    if (commentFound.user.toString() !== userID.toString()) {
      return next(
        appErr("You are not authorized to update this comment.", 401)
      );
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        message,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      user: updatedComment,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  commentDeleteCtrl,
  commentUpdateCtrl,
};
