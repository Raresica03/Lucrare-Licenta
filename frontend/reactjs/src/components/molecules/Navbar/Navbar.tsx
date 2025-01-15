import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { useUser } from "../../../utils/UserContext";

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { user, logout } = useUser(); // Use the logout function from UserContext
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from the UserContext
    navigate("/signin"); // Redirect to the sign-in page
  };

  return (
    <nav>
      <Link to="/" className="logo">
        MyLogo
      </Link>
      {user.isAuthenticated && (
        <div className="user-profile">
          <span className="user-name">
            {user.firstName} {user.lastName}
          </span>
          <div className="user-picture" onClick={toggleDropdown}>
            <img src="/path/to/placeholder-image.png" alt="Profile" />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  My Profile
                </Link>
                <Link to="/history" className="dropdown-item">
                  History
                </Link>
                {user.role === "Admin" && (
                  <Link to="/admin" className="dropdown-item">
                    Admin Dashboard
                  </Link>
                )}
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
