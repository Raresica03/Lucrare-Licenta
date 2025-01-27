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
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [name, setName] = useState(""); // Faculty name input state
  const [description, setDescription] = useState(""); // Faculty description input state
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
        setIsModalOpen(false); // Close the modal after successful addition
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message); // Access the error message if it's an Error object
        } else {
          alert("An unexpected error occurred."); // Fallback for unknown errors
        }
      }
    } else {
      alert("Both name and description are required.");
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
                Add Faculty
              </button>
            </div>

            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Add Faculty</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddFaculty();
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="faculty-name">Faculty Name</label>
                      <input
                        id="faculty-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="faculty-description">Description</label>
                      <textarea
                        id="faculty-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="modal-submit-button">
                        Add
                      </button>
                      <button
                        type="button"
                        className="modal-cancel-button"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
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
