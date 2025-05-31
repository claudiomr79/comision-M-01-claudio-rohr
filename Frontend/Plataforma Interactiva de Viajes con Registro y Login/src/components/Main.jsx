import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For linking to single post pages
import { getAllPosts } from '../services/postService';
// CommentList and AddCommentForm will be moved to a single post view later.

function Main() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts || []); // Ensure posts is always an array
      } catch (err) {
        setError(err.message || 'Failed to load posts.');
        console.error("Error fetching posts:", err);
        setPosts([]); // Clear posts on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <main className="container">
      <h1>Latest Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available yet. Why not create one?</p>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <article key={post.id} className="post-summary" style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px' }}>
              <h2>{post.title}</h2>
              <p>{post.desc ? post.desc.substring(0, 100) + '...' : 'No description.'}</p>
              {post.image && <img src={post.image} alt={post.title} style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', marginBottom: '10px' }} />}
              <p><small>Author ID: {post.userId}</small></p>
              <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'blue' }}>Read more</Link>
            </article>
          ))}
        </div>
      )}
      {/*
        The single post display and comment section previously here will be moved
        to a dedicated single post page component (e.g., PostPage.jsx or similar).
        For now, Main.jsx focuses on listing all posts.
      */}
    </main>
  );
}

export default Main;