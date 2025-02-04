import { useState } from "react";
import { PropsWithChildren } from "react";
import { Faculty } from "../../../utils/types/Faculty";
import "./FacultieTemplate.scss";
import { deleteFaculty, editFaculty } from "../../../utils/api";
import { useUser } from "../../../utils/UserContext";
import { useNavigate } from "react-router-dom";

interface FacultieTemplateProps extends PropsWithChildren {
  faculties: Faculty[];
}

export function FacultieTemplate({
  faculties,
  children,
}: FacultieTemplateProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [updateModalFaculty, setUpdateModalFaculty] = useState<Faculty | null>(
    null
  );
  const [deleteModalFaculty, setDeleteModalFaculty] = useState<Faculty | null>(
    null
  );
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const openUpdateModal = (faculty: Faculty) => {
    setUpdateModalFaculty(faculty);
    setUpdatedName(faculty.name);
    setUpdatedDescription(faculty.description);
  };

  const handleUpdate = async () => {
    if (updateModalFaculty && updatedName && updatedDescription) {
      try {
        await editFaculty(updateModalFaculty.id, {
          name: updatedName,
          description: updatedDescription,
        });
        alert("Facultate actualizată cu succes!");
        window.location.reload();
      } catch (error) {
        alert(error);
      } finally {
        setUpdateModalFaculty(null);
      }
    } else {
      alert("Toate câmpurile sunt necesare.");
    }
  };

  const openDeleteModal = (faculty: Faculty) => {
    setDeleteModalFaculty(faculty);
  };

  const handleDelete = async () => {
    if (deleteModalFaculty) {
      try {
        await deleteFaculty(deleteModalFaculty.id);
        alert("Facultate ștearsă cu succes!");
        window.location.reload();
      } catch (error) {
        alert(error);
      } finally {
        setDeleteModalFaculty(null);
      }
    }
  };

  const handleLearnMore = (facultyId: number) => {
    navigate(`/rooms/${facultyId}`);
  };

  return (
    <div className="faculties-page">
      <div className="faculties-container">
        {faculties.map((faculty) => (
          <div key={faculty.id} className="faculty-card">
            <h3>{faculty.name}</h3>
            <p>{faculty.description}</p>
            <div className="faculty-footer">
              <button
                className="faculty-button"
                onClick={() => handleLearnMore(faculty.id)}
              >
                Săli disponibile
              </button>
              {user.role === "Admin" && (
                <>
                  <button
                    className="faculty-edit-button"
                    onClick={() => openUpdateModal(faculty)}
                  >
                    Actualizare
                  </button>
                  <button
                    className="faculty-delete-button"
                    onClick={() => openDeleteModal(faculty)}
                  >
                    Ștergere
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {updateModalFaculty && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Actualizează facultatea</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <div className="form-group">
                <label htmlFor="faculty-name">Numele facultății</label>
                <input
                  id="faculty-name"
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="faculty-description">Descriere</label>
                <textarea
                  id="faculty-description"
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="modal-submit-button">
                  Actualizează
                </button>
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={() => setUpdateModalFaculty(null)}
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalFaculty && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Șterge facultatea</h2>
            <p>Ești sigur că dorești să ștergi facultatea "{deleteModalFaculty.name}"?</p>
            <div className="modal-actions">
              <button className="modal-submit-button" onClick={handleDelete}>
                Șterge
              </button>
              <button
                className="modal-cancel-button"
                onClick={() => setDeleteModalFaculty(null)}
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
