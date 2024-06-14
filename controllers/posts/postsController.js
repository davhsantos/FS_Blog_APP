const User = require("../../model/user/User");
const Post = require("../../model/post/Post");
const appErr = require("../../utils/appErr");

// Create a new post
const createPostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return next(appErr("All fields are required."));
    }
    // Get user ID
    const userID = req.session.userAuth;
    // Find the user
    const userFound = await User.findById(userID);
    // Create a new post
    const postCreated = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      author: userID,
    });
    // Push the new post to the array of user posts
    userFound.posts.push(postCreated._id);
    // resave the user
    await userFound.save();
    res.json({
      status: "success",
      data: postCreated,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Get all posts
const listPostCtrl = async (req, res, next) => {
  try {
    const postsFound = await Post.find().populate("comments");
    res.json({
      status: "success",
      data: postsFound,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// fetch single post
const postDetailsCtrl = async (req, res, next) => {
  try {
    // Get the ID from params
    const postID = req.params.id;
    // Find the post
    const postFound = await Post.findById(postID).populate("comments");
    res.json({
      status: "success",
      data: postFound,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// DELETE/api/v1/posts
const postDeleteCtrl = async (req, res, next) => {
  try {
    // Get the user id
    const userID = req.session.userAuth;
    // Find the user
    const userFound = await User.findById(userID);
    // Find the post
    const postFound = await Post.findById(req.params.id);
    // Check if the post exists
    if (!postFound) {
      return next(appErr("Post not found.", 404));
    }
    // Check if the post belongs to the user
    if (postFound.author.toString() !== userID) {
      return next(appErr("You are not authorized to delete this post.", 401));
    }
    // Delete post
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "Post has been deleted successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// PUT/api/v1/posts
const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    // Get the user id
    const userID = req.session.userAuth;
    // Find the post
    const postFound = await Post.findById(req.params.id);
    // Check if the post exists
    if (!postFound) {
      return next(appErr("Post not found.", 404));
    }
    // Check if the post belongs to the user
    if (postFound.author.toString() !== userID.toString()) {
      return next(appErr("You are not authorized to update this post.", 401));
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postFound.id,
      {
        title,
        description,
        category,
        image: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: updatedPost,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createPostCtrl,
  listPostCtrl,
  postDetailsCtrl,
  postDeleteCtrl,
  updatePostCtrl,
};
