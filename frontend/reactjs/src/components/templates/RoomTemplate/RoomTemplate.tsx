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
    "Laborator" | "Seminar" | "Curs"
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
        alert("Sală actualizată cu succes!");
        window.location.reload();
      } catch (error) {
        alert(error);
      } finally {
        setUpdateModalRoom(null);
      }
    } else {
      alert("Toate câmpurile sunt necesare.");
    }
  };

  const openDeleteModal = (room: Room) => {
    setDeleteModalRoom(room);
  };

  const handleDelete = async () => {
    if (deleteModalRoom) {
      try {
        await deleteRoom(deleteModalRoom.id);
        alert("Sală ștearsă cu succes!");
        window.location.reload();
      } catch (error) {
        alert(error);
      } finally {
        setDeleteModalRoom(null);
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
            <p>Tip: {room.roomType}</p>
            <div className="room-footer">
              {user.role === "Admin" && (
                <>
                  <button
                    className="room-edit-button"
                    onClick={() => openUpdateModal(room)}
                  >
                    Actualizează
                  </button>
                  <button
                    className="room-delete-button"
                    onClick={() => openDeleteModal(room)}
                  >
                    Șterge
                  </button>
                </>
              )}
              <button
                className="room-reserve-button"
                onClick={() => setSelectedRoom(room)}
              >
                Rezervă
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

      {updateModalRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Actualizează sală</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <div className="form-group">
                <label htmlFor="room-name">Numele sălii</label>
                <input
                  id="room-name"
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="room-description">Descriere</label>
                <textarea
                  id="room-description"
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="room-type">Tipul sălii</label>
                <select
                  id="room-type"
                  value={updatedRoomType}
                  onChange={(e) =>
                    setUpdatedRoomType(
                      e.target.value as "Laborator" | "Seminar" | "Curs"
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
                  Actualizează
                </button>
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={() => setUpdateModalRoom(null)}
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Șterge sală</h2>
            <p>
              Ești sigur că dorești să ștergi sala "{deleteModalRoom.name}"?
            </p>
            <div className="modal-actions">
              <button className="modal-submit-button" onClick={handleDelete}>
                Șterge
              </button>
              <button
                className="modal-cancel-button"
                onClick={() => setDeleteModalRoom(null)}
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
