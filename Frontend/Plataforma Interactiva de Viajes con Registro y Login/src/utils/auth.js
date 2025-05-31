const TOKEN_KEY = 'authToken';

export const storeToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Optional: Function to get user data from token (if you store more than just the token string)
// Or a function to decode the token to get user info (not recommended for sensitive data on client-side)
// For now, we'll assume the backend sends user info separately or the token itself is enough.

export const isAuthenticated = () => {
  const token = getToken();
  // Add more sophisticated token validation if needed (e.g., check expiration)
  // For this basic setup, presence of token means authenticated.
  return !!token;
};
