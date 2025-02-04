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
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loginModel: LoginModel = { email, password };
      const { token, user } = await loginUser(loginModel);

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      setUser({
        role: user.role,
        isAuthenticated: true,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      navigate("/");
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError("Eroare în timpul conectării. Te rog ăncearcî din nou.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleTemplate>
      <div className="signin-container">
        <h1 className="signin-title">UniRum</h1>
        <p className="signin-description">
          Conectează-te aici!
        </p>

        {error && <div className="signin-error">{error}</div>}
        {loading && <div className="signin-loading">Te conectăm...</div>}

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
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="signup-link">
          Nu ai cont? <Link to="/signup">Inregistrează-te aici!</Link>
        </p>
      </div>
    </SimpleTemplate>
  );
}
