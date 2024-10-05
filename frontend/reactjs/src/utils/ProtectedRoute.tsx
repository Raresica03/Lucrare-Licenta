import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signup" />;
  }

  return <>{children}</>;
}
