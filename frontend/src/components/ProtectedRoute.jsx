import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Role-Based Access Control wrapper.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The route content to render
 * @param {string} [props.requiredRole] - 'admin' | 'citizen' (if omitted, any authenticated user can access)
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const userData = localStorage.getItem('bocra_user');

  // Not logged in → redirect to login
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  // Role check: if a specific role is required, enforce it
  if (requiredRole && user.userType !== requiredRole) {
    // Citizens trying to access admin → back to citizen dashboard
    if (requiredRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    // Admins trying to access citizen-only → back to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
