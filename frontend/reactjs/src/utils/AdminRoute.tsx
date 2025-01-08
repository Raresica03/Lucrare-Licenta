import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useUser(); // Access user info from the context

  if (!user.isAuthenticated || user.role !== "Admin") {
    return <Navigate to="/signin" />;
  }

  return children;
}