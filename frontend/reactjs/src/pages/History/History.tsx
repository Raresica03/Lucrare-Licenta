import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { useState, useEffect } from "react";
import "./History.scss";
import { ProtectedRoute } from "../../utils/ProtectedRoute";
import {
  fetchUserReservations,
  fetchAllReservations,
  cancelReservation,
} from "../../utils/api";
import { useUser } from "../../utils/UserContext";
import { Reservation } from "../../utils/types/Reservation";
import { ReservationTemplate } from "../../components/templates/ReservationTemplate/ReservationTemplate";

export function History() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          user.role === "Admin"
            ? await fetchAllReservations()
            : await fetchUserReservations();

        setReservations(data);
      } catch (error) {
        setError("Failed to load reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user.role]);

  const handleCancel = async (reservationId: number) => {
    try {
      await cancelReservation(reservationId);
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== reservationId)
      );
      alert("Reservation canceled successfully!");
    } catch (error) {
      alert("Failed to cancel the reservation.");
    }
  };

  if (loading) {
    return <p>Loading reservation history...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <ProtectedRoute>
      <SimpleTemplate>
        <h1>Reservation History</h1>
        <div className="history-container">
          {reservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <div className="history-list">
              {reservations.map((reservation) => (
                <ReservationTemplate
                  key={reservation.id}
                  reservation={reservation}
                  userRole={user.role}
                  // Always pass the handleCancel function to the onCancel prop
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </div>
      </SimpleTemplate>
    </ProtectedRoute>
  );
}
