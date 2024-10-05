import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { ProtectedRoute } from "../../utils/ProtectedRoute";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/faculties");
  };

  return (
    <ProtectedRoute>
      <SimpleTemplate>
        <div className="dashboard-container">
          <div className="dashboard-title">My Awesome Project</div>
          <div className="dashboard-description">
            This project is designed to solve real-world problems by leveraging
            the latest technology and innovative solutions. It's built with a
            focus on user experience and modern design principles.
          </div>
          <button className="dashboard-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </SimpleTemplate>
    </ProtectedRoute>
  );
}
