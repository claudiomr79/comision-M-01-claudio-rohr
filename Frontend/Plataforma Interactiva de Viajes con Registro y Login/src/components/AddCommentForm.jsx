import React, { useState } from 'react';
import { createComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';

function AddCommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <p>Please <a href="/login">login</a> to add a comment.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Comment text cannot be empty.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const newComment = await createComment(postId, { text });
      onCommentAdded(newComment); // Callback to notify parent (e.g., to refresh list)
      setText(''); // Clear form
    } catch (err) {
      setError(err.message || 'Failed to submit comment.');
      console.error("Error submitting comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-comment-form">
      <h4>Add a Comment</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment here..."
          rows="3"
          required
          disabled={isSubmitting}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
}

export default AddCommentForm;
