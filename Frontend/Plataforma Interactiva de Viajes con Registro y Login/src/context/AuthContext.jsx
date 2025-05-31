import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, storeToken, removeToken } from '../utils/auth';
// Optional: import a service to verify token and get user details, e.g., userService.getMe()

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true, // To handle async initialization
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          // OPTIONAL: Verify token with backend and get user details
          // For example: const user = await userService.getMe(token);
          // If verification fails, removeToken() and set to unauthenticated.
          // For now, just having a token means authenticated.
          // In a real app, you'd fetch user details here.
          setAuthState({
            token,
            user: { name: 'Placeholder User' }, // Replace with actual user data from token or API
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to initialize auth state:", error);
          removeToken(); // Token is invalid or expired
          setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = (token, userData) => {
    storeToken(token);
    setAuthState({
      token,
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    removeToken();
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Optionally redirect to login page or homepage here or in the component calling logout
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) { // Added null check
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
