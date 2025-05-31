// Base URL for the API.
// In a real Vite app, you might use import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = '/api'; // Adjust if your backend is hosted elsewhere or has a different prefix

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Signup failed with status: ${response.status}`);
  }
  return response.json(); // Returns { user, token }
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Login failed with status: ${response.status}`);
  }
  return response.json(); // Returns { user, token }
};
