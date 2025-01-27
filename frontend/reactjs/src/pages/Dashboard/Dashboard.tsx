import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { useUser } from "../../utils/UserContext";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/faculties");
  };
  const handleRedirectToSignUp = () => {
    navigate("/signup");
  };

  return (
    <SimpleTemplate>
      <div className="dashboard-container">
        <div className="dashboard-title">My Awesome Project</div>
        <div className="dashboard-description">
          This project is designed to solve real-world problems by leveraging
          the latest technology and innovative solutions. It's built with a
          focus on user experience and modern design principles.
        </div>
        {!user.isAuthenticated && (
          <div>
            <div className="dashboard-description">
              Don't have an account yet?
            </div>
            <button
              className="dashboard-button"
              onClick={handleRedirectToSignUp}
            >
              Sign Up
            </button>
          </div>
        )}
        {user.isAuthenticated && (
          <div>
            <button className="dashboard-button" onClick={handleGetStarted}>
              Faculties
            </button>
          </div>
        )}
      </div>
    </SimpleTemplate>
  );
}
