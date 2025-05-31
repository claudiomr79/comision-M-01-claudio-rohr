import { getToken } from '../utils/auth';

const API_BASE_URL = '/api'; // Should be consistent with authService

export const getCommentsByPostId = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to get comments: ${response.status}`);
  }
  return response.json();
};

export const createComment = async (postId, commentData) => {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication token not found. Please login.');
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(commentData), // e.g., { text: "My comment" }
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Handle specific error for unauthorized if needed
    if (response.status === 401) {
        throw new Error(errorData.message || 'You are not authorized to post this comment.');
    }
    throw new Error(errorData.message || `Failed to create comment: ${response.status}`);
  }
  return response.json(); // Returns the newly created comment
};
