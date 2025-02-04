import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { user } = useUser();

  if (user.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}
