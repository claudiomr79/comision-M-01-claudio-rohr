import { commentModel } from '../models/comment-model.js';
import { postModel } from '../models/post-model.js';
import { userModel } from '../models/user-model.js'; // Import userModel

export const createComment = (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;
  // req.user should be populated by the protectRoute middleware
  const userId = req.user && req.user.userId; // Ensure req.user exists and has userId

  if (!userId) {
    // This case should ideally be caught by protectRoute if no valid token is provided,
    // but as a safeguard:
    return res.status(401).json({ message: 'Not authorized or user ID missing from token.' });
  }

  // Verify post exists
  const post = postModel.findOne({ id: postId }); // postModel.findOne expects an object {id: value}
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  const newComment = commentModel.create({ text, postId: parseInt(postId, 10), userId });

  if (!newComment) {
    // This might happen if the model's internal validation fails (e.g., missing fields)
    return res.status(400).json({ message: 'Failed to create comment due to invalid data.' });
  }

  res.status(201).json(newComment);
};

export const getCommentsByPostId = (req, res) => {
  const { postId } = req.params;
  const numericPostId = parseInt(postId, 10); // Ensure postId is a number

  if (isNaN(numericPostId)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  // Verify post exists
  const post = postModel.findOne({ id: numericPostId });
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  const comments = commentModel.findByPostId(numericPostId); // Use numericPostId

  // Populate author information for each comment
  const populatedComments = comments.map(comment => {
    const author = userModel.findById(comment.userId); // Assuming userModel.findById exists and works
    return {
      ...comment,
      author: author ? { id: author.id, username: author.username } : { username: 'Unknown User' }
    };
  });

  res.status(200).json(populatedComments);
};
