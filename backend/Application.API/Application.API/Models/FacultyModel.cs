namespace Application.API.Models
{
    public class FacultyModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public ICollection<RoomModel> Rooms { get; set; }
    }
}
