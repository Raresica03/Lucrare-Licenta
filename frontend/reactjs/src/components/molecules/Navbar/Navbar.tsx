import { useState } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav>
      <Link to="/" className="logo">
        MyLogo
      </Link>
      <div className="user-profile">
        <span className="user-name">John Doe</span>
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
              <button className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
