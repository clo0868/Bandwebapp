import { Navigate } from "react-router-dom";
import React from 'react';


export const ProtectedRoute = ({ children }) => {
  if (!sessionStorage.TOKEN) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
