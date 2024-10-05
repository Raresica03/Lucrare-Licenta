import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`${user.firstName} ${user.lastName}`);
      setIsAdmin(user.role === "Admin");
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/signin");
  };

  return (
    <nav>
      <Link to="/" className="logo">
        MyLogo
      </Link>
      <div className="user-profile">
        <span className="user-name">{userName}</span>
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
              {isAdmin && (
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
    </nav>
  );
}
