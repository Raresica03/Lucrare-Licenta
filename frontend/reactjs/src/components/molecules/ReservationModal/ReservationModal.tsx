import { useState, useEffect } from "react";
import Calendar from "react-calendar"; 
import "react-calendar/dist/Calendar.css"; 
import "./ReservationModal.scss";
import { fetchUnavailableSlots, reserveRoom } from "../../../utils/api";

interface ReservationModalProps {
  room: { id: number; name: string };
  onClose: () => void;
}

export default function ReservationModal({
  room,
  onClose,
}: ReservationModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const timeSlots = [
    "08:00-10:00",
    "10:00-12:00",
    "12:00-14:00",
    "14:00-16:00",
    "16:00-18:00",
    "18:00-20:00",
  ];

  const now = new Date(); 

  
  useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        try {
          const unavailable = await fetchUnavailableSlots(
            room.id,
            selectedDate
          );
          setUnavailableSlots(unavailable);
        } catch (error) {
          alert("Failed to fetch unavailable slots.");
        }
      };
      fetchSlots();
    }
  }, [selectedDate, room.id]);

  const handleReserve = async () => {
    if (selectedDate && selectedSlot) {
      try {
        await reserveRoom(room.id, selectedDate, selectedSlot);
        alert("Sală rezervată cu succes!");
        onClose(); 
      } catch (error) {
        alert("Eroare la rezervarea sălii.");
      }
    } else {
      alert("Te rog selectează o dată și un interval orar.");
    }
  };

  const isDateInPast = (date: Date) =>
    date.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0);

  const isSlotInPast = (slot: string) => {
    if (!selectedDate) return false;

    const [startTime, endTime] = slot.split("-");
    const slotEndTime = new Date(selectedDate);
    const [hours, minutes] = endTime.split(":").map(Number);
    slotEndTime.setHours(hours, minutes);

    return slotEndTime <= now; 
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Rezervă {room.name}</h2>
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value);
            } else if (Array.isArray(value) && value.length > 0) {
              setSelectedDate(value[0]);
            }
          }}
          tileDisabled={({ date }) => isDateInPast(date)} 
        />
        {selectedDate && (
          <div className="time-slots">
            <h3>Selectează un interval orar</h3>
            {timeSlots.map((slot) => (
              <button
                key={slot}
                className={`time-slot-button ${
                  unavailableSlots.includes(slot) || isSlotInPast(slot)
                    ? "unavailable"
                    : "available"
                } ${selectedSlot === slot ? "selected" : ""}`}
                onClick={() =>
                  !unavailableSlots.includes(slot) &&
                  !isSlotInPast(slot) &&
                  setSelectedSlot(slot)
                }
                disabled={unavailableSlots.includes(slot) || isSlotInPast(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button
            onClick={handleReserve}
            disabled={!selectedSlot || !selectedDate}
          >
            Rezervă
          </button>
          <button onClick={onClose}>Anuleaza</button>
        </div>
      </div>
    </div>
  );
}
