import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { Room } from "../../utils/types/Room";
import { useState, useEffect } from "react";
import "./Rooms.scss";
import { ProtectedRoute } from "../../utils/ProtectedRoute";
import { RoomTemplate } from "../../components/templates/RoomTemplate/RoomTemplate";
import { fetchRooms, addRoom } from "../../utils/api";
import { useUser } from "../../utils/UserContext";
import { useParams } from "react-router-dom";

export function Rooms() {
  const { facultyId } = useParams<{ facultyId: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState<"Laboratory" | "Seminar" | "Course">(
    "Seminar"
  );
  const { user } = useUser();

  useEffect(() => {
    const fetchAndSetRooms = async () => {
      try {
        const roomsData = await fetchRooms(Number(facultyId));

        // Filter rooms based on user role
        let filteredRooms = roomsData;
        if (user.role === "Student") {
          filteredRooms = roomsData.filter(
            (room) => room.roomType === "Seminar"
          );
        }

        setRooms(filteredRooms);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to fetch rooms");
      }
    };

    if (facultyId) {
      fetchAndSetRooms();
    }
  }, [facultyId, user.role]);

  const handleAddRoom = async () => {
    if (name && description && roomType) {
      try {
        await addRoom({
          name,
          description,
          facultyId: Number(facultyId),
          roomType,
        });
        const updatedRooms = await fetchRooms(Number(facultyId));
        setRooms(updatedRooms);
        setIsModalOpen(false);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to add room");
      }
    } else {
      alert("All fields are required.");
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
                className="add-room-button"
              >
                Add Room
              </button>
            </div>

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
                    <div className="form-group">
                      <label htmlFor="room-type">Room Type</label>
                      <select
                        id="room-type"
                        value={roomType}
                        onChange={(e) =>
                          setRoomType(
                            e.target.value as
                              | "Laboratory"
                              | "Seminar"
                              | "Course"
                          )
                        }
                        required
                      >
                        <option value="Laboratory">Laboratory</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Course">Course</option>
                      </select>
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
