using System.Text.Json.Serialization;

namespace Application.API.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public DateTime Date { get; set; }
        public string TimeSlot { get; set; }
        public string UserId { get; set; } // Change from int to string

        // Navigation properties
        [JsonIgnore]
        public RoomModel Room { get; set; }
        [JsonIgnore]
        public ApplicationUser User { get; set; } // Navigation to ApplicationUser
    }
}
