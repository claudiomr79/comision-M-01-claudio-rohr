import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    // You might want to show a loading spinner here
    return <div>Loading authentication status...</div>;
  }

  if (!authState.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />; // Render children or Outlet for nested routes
};

export default ProtectedRoute;
