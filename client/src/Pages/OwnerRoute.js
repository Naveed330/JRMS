import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OwnerRoute({ children }) {
  const { state } = useContext(AuthContext);
  const { user } = state;

  useEffect(() => {
    if (user && user.role !== "owner") {
      toast.error("You are not authorized. Please login again.");
      alert("You are not authorized. Please login again.");
    }
  }, [user]);

  if (user && user.role !== "owner") {
    alert("You are not authorized. Please login again.");
    return <Navigate to="/" />;
  }

  return children;
}
