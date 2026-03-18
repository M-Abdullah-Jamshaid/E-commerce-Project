import React from "react";
import { Navigate } from "react-router-dom";
import API_URL from "../config";

export default function AdminRoute({ children }) {
  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;

  // 1. Check if user exists AND is Admin
  if (user && user.isAdmin) {
    return children; // Allow access
  }

  // 2. If not admin, kick them to Home
  return <Navigate to="/" replace />;
}