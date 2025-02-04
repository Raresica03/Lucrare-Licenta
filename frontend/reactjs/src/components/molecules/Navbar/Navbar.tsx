import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { useUser } from "../../../utils/UserContext";
import logo_upt from "../../../utils/images/logo_upt.png";
import profile from "../../../utils/images/profile.png";

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };
  const handleRedirectToSignIn = () => {
    navigate("/signin");
  };

  return (
    <nav>
      <Link to="/" className="logo">
        <div className="logo-container">
          <img src={logo_upt} alt="MyLogo" className="logo-img" />
        </div>
      </Link>
      {user.isAuthenticated && (
        <div className="user-profile">
          <span className="user-name">
            {user.firstName} {user.lastName}
          </span>
          <div className="user-picture" onClick={toggleDropdown}>
            <img src={profile} alt="profile" className="profile" />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/history" className="dropdown-item">
                  Istoric rezervări
                </Link>
                {user.role === "Admin" && (
                  <Link to="/admin" className="dropdown-item">
                    Panou admin
                  </Link>
                )}
                <button className="dropdown-item" onClick={handleLogout}>
                  Deconectează-te
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {!user.isAuthenticated && (
        <button className="dashboard-button" onClick={handleRedirectToSignIn}>
          Conectează-te
        </button>
      )}
    </nav>
  );
}
