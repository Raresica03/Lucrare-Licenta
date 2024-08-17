import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import "./SignIn.scss";
import { Link } from "react-router-dom";

export function SignIn() {
  return (
    <SimpleTemplate hideNavbar={true}>
      <div className="signin-container">
        <h1 className="signin-title">Welcome Back to My Awesome App</h1>
        <p className="signin-description">
          Sign in to continue your journey with us!
        </p>

        <form className="signin-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
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
