using Application.API.Models;
using System.Text.Json.Serialization;

public class RoomModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int FacultyId { get; set; }
    public string RoomType { get; set; }
    [JsonIgnore]
    public FacultyModel Faculty { get; set; }
    [JsonIgnore]
    public ICollection<Reservation> Reservations { get; set; }
}
