import { postModel } from "../models/post-model.js";

export function ctrlCreatePost(req, res) {
  const { title, desc, image } = req.body;
  const userId = req.user.userId; // Assuming protectRoute populates req.user.userId

  if (!userId) {
    // This should ideally be caught by protectRoute, but as a safeguard
    return res.status(401).json({ message: "User ID not found. Authorization issue." });
  }

  const newPost = postModel.create({ title, desc, image, userId });

  if (!newPost) {
    // This could happen if title or userId is missing, as per model validation
    return res.status(400).json({ message: "Failed to create post. Title and userId are required." });
  }

  res.status(201).json(newPost);
}

export const ctrlGetAllPosts = (req, res) => {
  const posts = postModel.findAll();

  res.json(posts);
};

export const ctrlGetPostById = (req, res) => {
  const { postId } = req.params;
  const numericPostId = parseInt(postId, 10);

  if (isNaN(numericPostId)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  const post = postModel.findOne({ id: numericPostId });

  if (!post) {
    return res.status(404).json({ message: "Post not found." }); // Send JSON response for consistency
  }

  res.status(200).json(post);
};

export const ctrlUpdatePost = (req, res) => {
  const { postId } = req.params;
  const numericPostId = parseInt(postId, 10);

  if (isNaN(numericPostId)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  const { title, desc, image } = req.body;
  const userId = req.user.userId;

  const post = postModel.findOne({ id: numericPostId });

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  if (post.userId !== userId) {
    return res.status(403).json({ message: "User not authorized to update this post." });
  }

  const updatedPost = postModel.update(numericPostId, { title, desc, image });

  // The model's update method already returns the updated post or null if not found (though we found it above)
  // So, !updatedPost check might be redundant if post object integrity is guaranteed after findOne.
  // However, keeping it for safety, or if model.update could fail for other reasons.
  if (!updatedPost) {
    return res.status(404).json({ message: "Post not found or update failed unexpectedly after authorization." });
  }

  res.status(200).json(updatedPost);
};

export const ctrlDeletePost = (req, res) => {
  const { postId } = req.params;
  const numericPostId = parseInt(postId, 10);
  const userId = req.user.userId;

  if (isNaN(numericPostId)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  const post = postModel.findOne({ id: numericPostId });

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  if (post.userId !== userId) {
    return res.status(403).json({ message: "User not authorized to delete this post." });
  }

  postModel.destroy({ id: numericPostId });

  res.status(200).json({ message: "Post deleted successfully." });
};
