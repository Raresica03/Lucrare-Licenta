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
        <div className="dashboard-title">UniRum</div>
        <div className="dashboard-description">
          "UniRum" este o aplicație web creată pentru studenți și profesori,
          oferind o soluție eficientă pentru rezervarea sălilor de seminar și
          laborator din cadrul unei universități.
        </div>
        <div className="dashboard-description">
          Aplicația permite utilizatorilor să vizualizeze disponibilitatea
          sălilor și să efectueze rezervări în funcție de nevoile lor, fie
          pentru predare, fie pentru ore, fie pentru studiu în grup.
        </div>
        {!user.isAuthenticated && (
          <div>
            <div className="dashboard-description">Nu ai cont încă?</div>
            <button
              className="dashboard-button"
              onClick={handleRedirectToSignUp}
            >
              Înregistreaza-te!
            </button>
          </div>
        )}
        {user.isAuthenticated && (
          <div>
            <div className="dashboard-description">
              Pentru a vedea facultățile disponibile, faceți click pe butonul de
              mai jos.
            </div>
            <button className="dashboard-button" onClick={handleGetStarted}>
              Facultăți
            </button>
          </div>
        )}
      </div>
    </SimpleTemplate>
  );
}
