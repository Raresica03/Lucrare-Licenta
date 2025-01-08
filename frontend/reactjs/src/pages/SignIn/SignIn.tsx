import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import "./SignIn.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/api";
import { LoginModel } from "../../utils/types/LoginModel";
import { useUser } from "../../utils/UserContext";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser } = useUser(); // Access the UserContext to set user info
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loginModel: LoginModel = { email, password };
      const { token, user } = await loginUser(loginModel);

      // Store the JWT and user details in sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Update the user context
      setUser({
        role: user.role,
        isAuthenticated: true,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // Redirect to the dashboard
      navigate("/");
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleTemplate hideNavbar={true}>
      <div className="signin-container">
        <h1 className="signin-title">Welcome Back to My Awesome App</h1>
        <p className="signin-description">
          Sign in to continue your journey with us!
        </p>

        {error && <div className="signin-error">{error}</div>}
        {loading && <div className="signin-loading">Signing you in...</div>}

        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="submit-button"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </SimpleTemplate>
  );
}
