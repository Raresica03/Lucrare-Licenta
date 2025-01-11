import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { Room } from "../../utils/types/Room";
import { useState, useEffect } from "react";
import "./Rooms.scss"; // Add styles specific to rooms if needed
import { ProtectedRoute } from "../../utils/ProtectedRoute";
import { RoomTemplate } from "../../components/templates/RoomTemplate/RoomTemplate";
import { fetchRooms, addRoom } from "../../utils/api";
import { useUser } from "../../utils/UserContext";
import { useParams } from "react-router-dom";

export function Rooms() {
  const { facultyId } = useParams<{ facultyId: string }>(); // Get facultyId from URL
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [name, setName] = useState(""); // Room name input state
  const [description, setDescription] = useState(""); // Room description input state
  const { user } = useUser();

  useEffect(() => {
    const fetchAndSetRooms = async () => {
      try {
        const roomsData = await fetchRooms(Number(facultyId));
        setRooms(roomsData);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to fetch rooms");
      }
    };

    if (facultyId) {
      fetchAndSetRooms();
    }
  }, [facultyId]);

  const handleAddRoom = async () => {
    if (name && description) {
      try {
        await addRoom({ name, description, facultyId: Number(facultyId) });
        const updatedRooms = await fetchRooms(Number(facultyId));
        setRooms(updatedRooms);
        setIsModalOpen(false); // Close the modal after successful addition
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message); // Display error message if it's an Error object
        } else {
          alert("An unexpected error occurred.");
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
            <button onClick={() => setIsModalOpen(true)} className="add-room-button">
              Add Room
            </button>

            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Add Room</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddRoom();
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="room-name">Room Name</label>
                      <input
                        id="room-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="room-description">Description</label>
                      <textarea
                        id="room-description"
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
        <RoomTemplate rooms={rooms}></RoomTemplate>
      </SimpleTemplate>
    </ProtectedRoute>
  );
}
