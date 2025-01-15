import { useState } from "react";
import { PropsWithChildren } from "react";
import { Room } from "../../../utils/types/Room";
import "./RoomTemplate.scss";
import { deleteRoom, editRoom } from "../../../utils/api";
import { useUser } from "../../../utils/UserContext";
import ReservationModal from "../../molecules/ReservationModal/ReservationModal";

interface RoomTemplateProps extends PropsWithChildren {
  rooms: Room[];
}

export function RoomTemplate({ rooms, children }: RoomTemplateProps) {
  const { user } = useUser();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [updateModalRoom, setUpdateModalRoom] = useState<Room | null>(null);
  const [deleteModalRoom, setDeleteModalRoom] = useState<Room | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedRoomType, setUpdatedRoomType] = useState<
    "Laboratory" | "Seminar" | "Course"
  >("Seminar");

  const openUpdateModal = (room: Room) => {
    setUpdateModalRoom(room);
    setUpdatedName(room.name);
    setUpdatedDescription(room.description);
    setUpdatedRoomType(room.roomType);
  };

  const handleUpdate = async () => {
    if (
      updateModalRoom &&
      updatedName &&
      updatedDescription &&
      updatedRoomType
    ) {
      try {
        await editRoom(updateModalRoom.id, {
          name: updatedName,
          description: updatedDescription,
          facultyId: updateModalRoom.facultyId,
          roomType: updatedRoomType,
        });
        alert("Room updated successfully!");
        window.location.reload();
      } catch (error) {
        alert(error);
      } finally {
        setUpdateModalRoom(null); // Close the modal
      }
    } else {
      alert("All fields are required.");
    }
  };

  const openDeleteModal = (room: Room) => {
    setDeleteModalRoom(room);
  };

  const handleDelete = async () => {
    if (deleteModalRoom) {
      try {
        await deleteRoom(deleteModalRoom.id);
        alert("Room deleted successfully!");
        window.location.reload();
      } catch (error) {
        alert(error);
      } finally {
        setDeleteModalRoom(null); // Close the modal
      }
    }
  };

  return (
    <div className="rooms-page">
      <div className="rooms-container">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <p>Type: {room.roomType}</p>
            <div className="room-footer">
              {user.role === "Admin" && (
                <>
                  <button
                    className="room-edit-button"
                    onClick={() => openUpdateModal(room)}
                  >
                    Update
                  </button>
                  <button
                    className="room-delete-button"
                    onClick={() => openDeleteModal(room)}
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                className="room-reserve-button"
                onClick={() => setSelectedRoom(room)}
              >
                Reserve
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedRoom && (
        <ReservationModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      {/* Update Room Modal */}
      {updateModalRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Room</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <div className="form-group">
                <label htmlFor="room-name">Room Name</label>
                <input
                  id="room-name"
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="room-description">Description</label>
                <textarea
                  id="room-description"
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="room-type">Room Type</label>
                <select
                  id="room-type"
                  value={updatedRoomType}
                  onChange={(e) =>
                    setUpdatedRoomType(
                      e.target.value as "Laboratory" | "Seminar" | "Course"
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
                  Update
                </button>
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={() => setUpdateModalRoom(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Room Modal */}
      {deleteModalRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Room</h2>
            <p>
              Are you sure you want to delete the room "{deleteModalRoom.name}"?
            </p>
            <div className="modal-actions">
              <button className="modal-submit-button" onClick={handleDelete}>
                Delete
              </button>
              <button
                className="modal-cancel-button"
                onClick={() => setDeleteModalRoom(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
