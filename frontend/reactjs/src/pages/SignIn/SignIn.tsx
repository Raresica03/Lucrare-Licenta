import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import "./SignIn.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/api";
import { LoginModel } from "../../utils/types/LoginModel";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const loginModel: LoginModel = { email, password };
      const { token, user } = await loginUser(loginModel);

      // Store the JWT and user details in sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Redirect to the dashboard
      navigate("/");
    } catch (err: any) {
      setError(err.message);
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
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </SimpleTemplate>
  );
}
