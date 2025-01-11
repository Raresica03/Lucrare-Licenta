namespace Application.API.Models
{
    public class RoomModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int FacultyId { get; set; }

        // Navigation property
        public FacultyModel Faculty { get; set; }
    }
}
