import Comment from "../models/comment-model.js";
import Post from "../models/post-model.js";

// Create comment
export const ctrlCreateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
    });

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating comment",
    });
  }
};

// Get comments for a post
export const ctrlGetPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ post: postId })
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ post: postId });

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
    });
  }
};

// Update comment
export const ctrlUpdateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    let comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user owns the comment
    if (
      comment.author._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this comment",
      });
    }

    comment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating comment",
    });
  }
};

// Delete comment
export const ctrlDeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user owns the comment
    if (
      comment.author._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting comment",
    });
  }
};
