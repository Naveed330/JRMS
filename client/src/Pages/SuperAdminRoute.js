import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuperAdminRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const { user } = state;

  useEffect(() => {
    if (user && user.role !== "superadmin") {
      toast.error("You are not authorized. Please login again.");
      // Redirect user or perform other actions here if needed
    }
  }, [user]);

  if (!user) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/" />;
  }

  if (user.role !== "superadmin") {
    // If user is logged in but not a superadmin, show error and redirect
    toast.error("You are not authorized. Please login again.");
    return <Navigate to="/" />;
  }

  // If user is logged in and is a superadmin, render children
  return children;
}

export default SuperAdminRoute;