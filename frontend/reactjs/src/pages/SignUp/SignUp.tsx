import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import "./SignUp.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../utils/api";
import { RegisterModel } from "../../utils/types/RegisterModel";

export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCardImage(event.target.files[0]);
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!cardImage) {
      setError("Please upload your card image.");
      return;
    }

    try {
      const registerModel: RegisterModel = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
        cardImage,
      };

      await registerUser(registerModel);

      // Redirect to the sign-in page after successful registration
      navigate("/signin");
    } catch (err: any) {
      setError(err.message); // Display error message to the user
    }
  };

  return (
    <SimpleTemplate hideNavbar={true}>
      <div className="signup-container">
        <h1 className="signup-title">Welcome to My Awesome App</h1>
        <p className="signup-description">
          Join us and start your journey today!
        </p>
        {error && <div className="signup-error">{error}</div>}{" "}
        {/* Display any errors */}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={handleRoleChange}
            required
            className="role-picker"
          >
            <option value="" disabled>
              Select your role
            </option>
            <option value="Student">Student</option>
            <option value="Professor">Professor</option>
          </select>

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
