namespace Application.API.Models
{
    public class ReservationRequest
    {
        public int RoomId { get; set; }
        public DateTime Date { get; set; }
        public string TimeSlot { get; set; }
    }
}
