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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        await deleteFaculty(id);
        alert("Faculty deleted successfully!");
        window.location.reload();
      } catch (error) {
        alert(error);
      }
    }
  };

  const handleUpdate = async (faculty: Faculty) => {
    const newName = prompt("Enter new faculty name:", faculty.name);
    const newDescription = prompt(
      "Enter new faculty description:",
      faculty.description
    );
    if (newName && newDescription) {
      try {
        await editFaculty(faculty.id, {
          name: newName,
          description: newDescription,
        });
        alert("Faculty updated successfully!");
        window.location.reload();
      } catch (error) {
        alert(error);
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
                Learn More
              </button>
              {user.role === "Admin" && (
                <>
                  <button
                    className="faculty-edit-button"
                    onClick={() => handleUpdate(faculty)}
                  >
                    Update
                  </button>
                  <button
                    className="faculty-delete-button"
                    onClick={() => handleDelete(faculty.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
