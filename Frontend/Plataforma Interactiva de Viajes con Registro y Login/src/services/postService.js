import { getToken } from '../utils/auth';

const API_BASE_URL = '/api/posts'; // Specific base URL for posts

// Helper function to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorData.message || `Request failed with status: ${response.status}`);
  }
  // Check if response is empty before trying to parse JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return null; // Or response.text() if you expect text for some non-JSON responses
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    // This case should ideally be handled by UI logic (e.g., redirect to login)
    // before calling services that require auth.
    throw new Error('Authentication token not found. Please login.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getAllPosts = async () => {
  const response = await fetch(API_BASE_URL);
  return handleResponse(response);
};

export const getPostById = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`);
  return handleResponse(response);
};

export const createPost = async (postData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData), // { title, desc, image }
  });
  return handleResponse(response);
};

export const updatePost = async (postId, postData) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });
  return handleResponse(response);
};

export const deletePost = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  // Delete might return no content (204) or a success message
  if (response.status === 204) {
    return null; // Or a success indicator like { success: true }
  }
  return handleResponse(response);
};
