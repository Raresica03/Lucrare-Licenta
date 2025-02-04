import "./ReservationTemplate.scss";
import { Reservation } from "../../../utils/types/Reservation";

interface ReservationTemplateProps {
  reservation: Reservation;
  userRole: string;
  onCancel?: (reservationId: number) => void; 
}

export function ReservationTemplate({
  reservation,
  userRole,
  onCancel,
}: ReservationTemplateProps) {
  return (
    <div className="reservation-card">
      <h3>Sală: {reservation.roomName}</h3>
      <p>Tip: {reservation.roomType}</p>
      <p>Facultate: {reservation.facultyName}</p>
      <p>Dată: {new Date(reservation.date).toLocaleDateString()}</p>
      <p>Interval orar: {reservation.timeSlot}</p>
      {userRole === "Admin" && reservation.user && (
        <p>
          Rezarvat de: {reservation.user.firstName} {reservation.user.lastName}
        </p>
      )}
      {onCancel && (
        <button
          onClick={() => onCancel(reservation.id)}
          className="cancel-button"
        >
          Anulează rezervare
        </button>
      )}
    </div>
  );
}
