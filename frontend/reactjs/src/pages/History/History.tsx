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
      alert("Rezervare anulată cu succes!");
    } catch (error) {
      alert("Eroare la anularea rezervării.");
    }
  };

  if (loading) {
    return <p>Se încarcă istoricul rezervărilor...</p>;
  }

  if (error) {
    return <p>Eroare: {error}</p>;
  }

  return (
    <ProtectedRoute>
      <SimpleTemplate>
        <h1>Istoric de rezervări</h1>
        <div className="history-container">
          {reservations.length === 0 ? (
            <p>Nici o rezervare găsită.</p>
          ) : (
            <div className="history-list">
              {reservations.map((reservation) => (
                <ReservationTemplate
                  key={reservation.id}
                  reservation={reservation}
                  userRole={user.role}
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
