import "./ReservationTemplate.scss";
import { Reservation } from "../../../utils/types/Reservation";

interface ReservationTemplateProps {
  reservation: Reservation;
  userRole: string;
  onCancel?: (reservationId: number) => void; // Optional if Admin
}

export function ReservationTemplate({
  reservation,
  userRole,
  onCancel,
}: ReservationTemplateProps) {
  return (
    <div className="reservation-card">
      <h3>Room: {reservation.roomName}</h3>
      <p>Type: {reservation.roomType}</p>
      <p>Faculty: {reservation.facultyName}</p>
      <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
      <p>Time Slot: {reservation.timeSlot}</p>
      {userRole === "Admin" && reservation.user && (
        <p>
          Reserved By: {reservation.user.firstName} {reservation.user.lastName}
        </p>
      )}
      {/* Show cancel button for non-Admin users */}
      {onCancel && (
        <button
          onClick={() => onCancel(reservation.id)}
          className="cancel-button"
        >
          Cancel Reservation
        </button>
      )}
    </div>
  );
}
