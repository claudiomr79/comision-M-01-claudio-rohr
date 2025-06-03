import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // API base URL
  const API_URL = "http://localhost:3002/api";
  useEffect(() => {
    console.log("AuthContext useEffect triggered, token:", token);

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log("Auth loading timeout reached, setting loading to false");
      setLoading(false);
    }, 5000); // 5 seconds timeout

    if (token) {
      // Verify token and get user data
      fetchUser().finally(() => {
        clearTimeout(loadingTimeout);
      });
    } else {
      console.log("No token found, setting loading to false");
      setLoading(false);
      clearTimeout(loadingTimeout);
    }

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [token]);
  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid, remove it
        console.log("Token invalid, clearing authentication");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      // Don't logout on network errors, just clear invalid tokens
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Error connecting to server" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Error connecting to server" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // API request helper with auth
  const apiRequest = async (url, options = {}) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(`${API_URL}${url}`, config);

    if (response.status === 401) {
      logout(); // Token expired or invalid
    }

    return response;
  };
  console.log(
    "AuthProvider render - loading:",
    loading,
    "user:",
    user,
    "token:",
    !!token
  );

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    apiRequest,
    isAuthenticated: !!user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
