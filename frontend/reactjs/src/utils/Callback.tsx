import { useEffect } from "react";
import { signInCallback } from "./authService";
import { useNavigate } from "react-router-dom";

export function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    signInCallback().then(() => {
      navigate("/");
    }).catch((error) => {
      console.error(error);
    });
  }, [navigate]);

  return <div>Loading...</div>;
}
