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
      setError("Încarcă legitimația ta.");
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

      navigate("/signin");
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError("Eroare în timpul înregistrării. Te rog încearca din nou.");
      }
    }
  };

  return (
    <SimpleTemplate>
      <div className="signup-container">
        <h1 className="signup-title">UniRum</h1>
        <p className="signup-description">
          Înregistrează-te acum!
        </p>
        {error && <div className="signup-error">{error}</div>}{" "}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Prenume"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nume"
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
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmare parolă"
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
              Selecteaza rolul tău
            </option>
            <option value="Student">Student</option>
            <option value="Professor">Profesor</option>
          </select>

          <input type="file" onChange={handleImageChange} />

          <button type="submit" className="submit-button">
            Înregistrează-te
          </button>
        </form>
        <p className="signin-link">
          Ai deja cont? <Link to="/signin">Conectează-te aici!</Link>
        </p>
      </div>
    </SimpleTemplate>
  );
}
