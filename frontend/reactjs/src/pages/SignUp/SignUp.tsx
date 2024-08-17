import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import "./SignUp.scss";
import { useState } from "react";
import { Link } from "react-router-dom";

export function SignUp() {
  const [profileImage, setProfileImage] = useState(
    "/path/to/placeholder-image.png"
  ); // Replace with actual path to placeholder image

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <SimpleTemplate hideNavbar={true}>
      <div className="signup-container">
        <h1 className="signup-title">Welcome to My Awesome App</h1>
        <p className="signup-description">
          Join us and start your journey today!
        </p>

        <form className="signup-form">
          <input type="text" placeholder="First Name" required />
          <input type="text" placeholder="Last Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="file" onChange={handleImageChange} />
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign in here</Link>
        </p>
      </div>
    </SimpleTemplate>
  );
}
