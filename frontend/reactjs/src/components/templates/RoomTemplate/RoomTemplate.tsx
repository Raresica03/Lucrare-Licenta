import { PropsWithChildren } from "react";
import { Room } from "../../../utils/types/Room";
import "./RoomTemplate.scss";
import { deleteRoom, editRoom } from "../../../utils/api";
import { useUser } from "../../../utils/UserContext";

interface RoomTemplateProps extends PropsWithChildren {
  rooms: Room[];
}

export function RoomTemplate({
  rooms,
  children,
}: RoomTemplateProps) {
  const { user } = useUser();

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id);
        alert("Room deleted successfully!");
        window.location.reload();
      } catch (error) {
        alert(error);
      }
    }
  };

  const handleUpdate = async (room: Room) => {
    const newName = prompt("Enter new room name:", room.name);
    const newDescription = prompt(
      "Enter new room description:",
      room.description
    );
    if (newName && newDescription) {
      try {
        await editRoom(room.id, {
          name: newName,
          description: newDescription,
          facultyId: room.facultyId, // Ensure facultyId is preserved during update
        });
        alert("Room updated successfully!");
        window.location.reload();
      } catch (error) {
        alert(error);
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
            <div className="room-footer">
              {user.role === "Admin" && (
                <>
                  <button
                    className="room-edit-button"
                    onClick={() => handleUpdate(room)}
                  >
                    Update
                  </button>
                  <button
                    className="room-delete-button"
                    onClick={() => handleDelete(room.id)}
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
