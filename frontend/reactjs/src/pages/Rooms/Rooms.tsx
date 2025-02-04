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
  const [roomType, setRoomType] = useState<"Laborator" | "Seminar" | "Curs">(
    "Seminar"
  );
  const { user } = useUser();

  useEffect(() => {
    const fetchAndSetRooms = async () => {
      try {
        const roomsData = await fetchRooms(Number(facultyId));

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
                Adaugă sală
              </button>
            </div>

            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Adaugă sală</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddRoom();
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="room-name">Numele sălii</label>
                      <input
                        id="room-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="room-description">Descriere</label>
                      <textarea
                        id="room-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="room-type">Tipul sălii</label>
                      <select
                        id="room-type"
                        value={roomType}
                        onChange={(e) =>
                          setRoomType(
                            e.target.value as
                              | "Laborator"
                              | "Seminar"
                              | "Curs"
                          )
                        }
                        required
                      >
                        <option value="Laborator">Laborator</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Curs">Curs</option>
                      </select>
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
        <RoomTemplate rooms={rooms}></RoomTemplate>
      </SimpleTemplate>
    </ProtectedRoute>
  );
}
