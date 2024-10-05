/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState } from "react";
import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { fetchPendingUsers, approveUser } from "../../utils/api";
import "./Admin.scss";
import { PendingUser } from "../../utils/types/PendingUser";
import { AdminRoute } from "../../utils/AdminRoute";

export function Admin() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPendingUsers() {
      try {
        const users = await fetchPendingUsers();
        setPendingUsers(users);
      } catch (error) {
        console.error("Failed to fetch pending users", error);
      }
    }

    loadPendingUsers();
  }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      await approveUser(userId);
      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to approve user", error);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <AdminRoute>
      <SimpleTemplate>
        <div className="admin-container">
          <h1 className="admin-title">Pending Registration Requests</h1>
          <ul className="pending-users-list">
            {pendingUsers.map((user) => (
              <li key={user.id} className="pending-user-item">
                {user.cardImage && (
                  <img
                    src={`data:image/png;base64,${user.cardImage}`}
                    alt={`${user.firstName} ${user.lastName} Card Image`}
                    className="card-image"
                    onClick={() =>
                      handleImageClick(
                        `data:image/png;base64,${user.cardImage}`
                      )
                    }
                  />
                )}
                <div className="user-info">
                  <h2>
                    {user.firstName} {user.lastName}
                  </h2>
                  <p>{user.role}</p>
                </div>
                <button
                  className="approve-button"
                  onClick={() => handleApproveUser(user.id)}
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>

          {/* Image Modal */}
          {selectedImage && (
            <div className="image-modal" onClick={closeImageModal}>
              <img src={selectedImage} alt="Full-size card image" />
            </div>
          )}
        </div>
      </SimpleTemplate>
    </AdminRoute>
  );
}
