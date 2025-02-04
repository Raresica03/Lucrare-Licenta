import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { Faculty } from "../../utils/types/Faculty";
import { useState, useEffect } from "react";
import "./Faculties.scss";
import { ProtectedRoute } from "../../utils/ProtectedRoute";
import { FacultieTemplate } from "../../components/templates/FacultieTemplate/FacultieTemplate";
import { fetchFaculties, addFaculty } from "../../utils/api";
import { useUser } from "../../utils/UserContext";

export function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 
  const { user } = useUser();

  useEffect(() => {
    fetchFaculties()
      .then(setFaculties)
      .catch((error) => alert(error.message));
  }, []);

  const handleAddFaculty = async () => {
    if (name && description) {
      try {
        await addFaculty({ name, description });
        const updatedFaculties = await fetchFaculties();
        setFaculties(updatedFaculties);
        setIsModalOpen(false); 
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message); 
        } else {
          alert("An unexpected error occurred."); 
        }
      }
    } else {
      alert("Nume și descriere necesare.");
    }
  };

  return (
    <ProtectedRoute>
      <SimpleTemplate>
        {user.role === "Admin" && (
          <>
            <div className="row">
              <button
                onClick={() => setIsModalOpen(true)}
                className="add-faculty-button"
              >
                Adaugă facultate
              </button>
            </div>

            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Adauga facultate</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddFaculty();
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="faculty-name">Numele facultății</label>
                      <input
                        id="faculty-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="faculty-description">Descriere</label>
                      <textarea
                        id="faculty-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="modal-submit-button">
                        Adaugă
                      </button>
                      <button
                        type="button"
                        className="modal-cancel-button"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Anulează
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
        <FacultieTemplate faculties={faculties}></FacultieTemplate>
      </SimpleTemplate>
    </ProtectedRoute>
  );
}
