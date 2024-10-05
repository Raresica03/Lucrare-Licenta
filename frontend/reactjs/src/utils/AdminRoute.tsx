import { Navigate } from "react-router-dom";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || user.role !== "Admin") {
    return <Navigate to="/signin" />;
  }

  return children;
}
