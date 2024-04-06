import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AdminRoute({ children }) {
  const { state } = useContext(AuthContext); // Use useContext hook to access AuthContext
  const { user } = state;
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("You are not authorized. Please login again.");
      alert("You are not authorized. Please login again.");
    }
  }, [user]);

  if (user && user.role !== "admin") {
    alert("You are not authorized. Please login again.");
    return <Navigate to="/" />;
  }

  return children;
}