import React, { useState, useEffect } from 'react';
import { getCommentsByPostId } from '../services/commentService';
import './Comment.css'; // Assuming you might want to style comments

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedComments = await getCommentsByPostId(postId);
        setComments(fetchedComments);
      } catch (err) {
        setError(err.message || 'Failed to load comments.');
        console.error("Error fetching comments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]); // Refetch if postId changes

  if (isLoading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (comments.length === 0) {
    return <p>No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="comment-list">
      <h4>Comments</h4>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <p className="comment-text">{comment.text}</p>
          <small className="comment-meta">
            By: {comment.author ? comment.author.username : 'Unknown User'} | Created: {new Date(comment.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
