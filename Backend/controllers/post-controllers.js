// Archivo: post-controllers.js
// Controladores de posts: crear, obtener, actualizar y eliminar posts con validación de permisos de autor

const Post = require("../models/post-model.js");
const Comment = require("../models/comment-model.js");

// Create new post
const ctrlCreatePost = async (req, res) => {
  try {
    const { title, desc, image, location, tags } = req.body;

    const post = await Post.create({
      title,
      desc,
      image,
      location,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating post",
    });
  }
};

// Get all posts
const ctrlGetAllPosts = async (req, res) => {
  try {
    // Devolver todos los posts sin paginación
    const posts = await Post.find().sort("-createdAt");
    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
    });
  }
};

// Get post by ID
const ctrlGetPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post",
    });
  }
};

// Update post
const ctrlUpdatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, desc, image, location, tags } = req.body;

    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user owns the post
    if (
      post.author._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    const updateData = {
      title,
      desc,
      image,
      location,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : post.tags,
    };

    post = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating post",
    });
  }
};

// Delete post
const ctrlDeletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user owns the post
    if (
      post.author._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: postId });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting post",
    });
  }
};

// Like/Unlike post
const ctrlToggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Ensure post.likes is an array before attempting to use array methods on it
    if (!Array.isArray(post.likes)) {
      console.warn(
        `Post with ID ${postId} had a non-array 'likes' field. Initializing to empty array.`
      );
      post.likes = [];
    }

    const likeIndex = post.likes.findIndex(
      (like) => like.user && like.user.toString() === userId
    );

    if (likeIndex > -1) {
      // Remove like
      post.likes.splice(likeIndex, 1);
    } else {
      // Add like
      post.likes.push({ user: userId });
    }

    await post.save();

    // Populate author details before sending the post back
    // The pre-find hook on Post model already populates 'author' with name and avatar.
    // This explicit populate ensures 'name' is definitely there if the selection was different.
    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name"
    );

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? "Post unliked" : "Post liked",
      post: populatedPost, // Send the full updated post object
    });
  } catch (error) {
    console.error("Toggle like error:", error); // This logs the specific error to the backend console
    res.status(500).json({
      success: false,
      message: "Error toggling like",
    });
  }
};

module.exports = {
  ctrlCreatePost,
  ctrlGetAllPosts,
  ctrlGetPostById,
  ctrlUpdatePost,
  ctrlDeletePost,
  ctrlToggleLikePost,
};
