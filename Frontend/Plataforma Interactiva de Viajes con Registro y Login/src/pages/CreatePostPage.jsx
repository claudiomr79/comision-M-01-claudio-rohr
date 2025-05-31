import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
// import { useAuth } from '../context/AuthContext'; // Not strictly needed if page is always protected

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(''); // For image URL
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { authState } = useAuth(); // authState.user.id could be used if backend didn't get it from token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newPostData = { title, desc, image };
      const createdPost = await createPost(newPostData);
      console.log('Post created successfully:', createdPost);
      // Assuming createdPost has an id, navigate to its page or home
      // If your backend returns the created post with its ID:
      // navigate(`/posts/${createdPost.id}`);
      // For now, navigate to home
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create post. Please try again.');
      console.error('Create post error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container" style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="desc" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
            rows="5"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Image URL:</label>
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '10px 15px' }}>
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
