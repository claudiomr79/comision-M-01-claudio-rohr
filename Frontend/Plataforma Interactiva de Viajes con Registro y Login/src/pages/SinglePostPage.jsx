import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../services/postService';
import CommentList from '../components/CommentList';
import AddCommentForm from '../components/AddCommentForm';
import { useAuth } from '../context/AuthContext'; // To check if user is owner for edit/delete buttons

function SinglePostPage() {
  const { postId } = useParams();
  const { authState } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentUpdateKey, setCommentUpdateKey] = useState(Date.now()); // For refreshing CommentList

  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPost = await getPostById(postId);
      setPost(fetchedPost);
    } catch (err) {
      setError(err.message || 'Failed to load post.');
      console.error("Error fetching post:", err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleNewComment = (newComment) => {
    console.log('New comment added, refreshing list in SinglePostPage:', newComment);
    setCommentUpdateKey(Date.now()); // Update key to force CommentList re-render
  };

  // TODO: Implement deletePostHandler and navigate after deletion
  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      // await deletePost(post.id);
      // navigate('/');
      console.log("Delete post clicked for post ID:", post.id);
      alert("Delete functionality to be implemented.");
    }
  };


  if (isLoading) {
    return <p>Loading post details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  const isOwner = authState.isAuthenticated && authState.user && authState.user.userId === post.userId;

  return (
    <div className="single-post-page" style={{ padding: '20px' }}>
      <article className="post-full-content">
        <h2>{post.title}</h2>
        {post.image && <img src={post.image} alt={post.title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '15px' }} />}
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.desc}</p> {/* Use desc as per backend model */}
        <p><small>Author ID: {post.userId}</small></p> {/* Display author ID */}

        {isOwner && (
          <div className="post-actions" style={{ marginTop: '10px', marginBottom: '20px' }}>
            {/* Link to EditPostPage to be created later */}
            {/* <Link to={`/posts/${post.id}/edit`} style={{ marginRight: '10px' }}>Edit Post</Link> */}
            <button onClick={() => alert("Edit functionality to be implemented.")} style={{ marginRight: '10px' }}>Edit Post</button>
            <button onClick={handleDeletePost} style={{ color: 'red' }}>Delete Post</button>
          </div>
        )}
      </article>

      <section className="comments-section" style={{ marginTop: '30px' }}>
        <h3>Comments</h3>
        <AddCommentForm postId={post.id} onCommentAdded={handleNewComment} />
        <CommentList postId={post.id} key={commentUpdateKey} />
      </section>
    </div>
  );
}

export default SinglePostPage;
