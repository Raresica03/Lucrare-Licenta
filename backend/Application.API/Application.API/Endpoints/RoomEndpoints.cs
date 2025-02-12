using Application.API.Data;
using Application.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Application.API.Endpoints
{
    public static class RoomEndpoints
    {
        public static RouteGroupBuilder MapRoomEndpoints(this RouteGroupBuilder builder)
        {
            var root = builder.MapGroup("/rooms")
                              .WithTags("Rooms")
                              .WithDescription("Endpoints for managing rooms and reservations")
                              .WithOpenApi();

            // Room management endpoints
            root.MapGet("/getRooms", GetAllRooms)
                .WithName("GetAllRooms")
                .WithDescription("Retrieve all rooms")
                .Produces(StatusCodes.Status200OK);

            root.MapGet("/getRoomsByFaculty/{facultyId}", GetRoomsByFaculty)
                .WithName("GetRoomsByFaculty")
                .WithDescription("Retrieve rooms for a specific faculty")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            root.MapPost("/addRoom", AddRoom)
                .WithName("AddRoom")
                .WithDescription("Add a new room")
                .Produces(StatusCodes.Status201Created)
                .Produces(StatusCodes.Status400BadRequest)
                .RequireAuthorization(policy => policy.RequireRole("Admin"));

            root.MapPut("/updateRoom/{id}", UpdateRoom)
                .WithName("UpdateRoom")
                .WithDescription("Update an existing room")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound)
                .Produces(StatusCodes.Status400BadRequest)
                .RequireAuthorization(policy => policy.RequireRole("Admin"));

            root.MapDelete("/deleteRoom/{id}", DeleteRoom)
                .WithName("DeleteRoom")
                .WithDescription("Delete a room by ID")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound)
                .RequireAuthorization(policy => policy.RequireRole("Admin"));

            // Reservation endpoints
            root.MapGet("/getUnavailableSlots/{roomId}/{date}", GetUnavailableSlots)
                .WithName("GetUnavailableSlots")
                .WithDescription("Retrieve unavailable time slots for a room on a specific date")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            root.MapPost("/reserveRoom", ReserveRoom)
                .WithName("ReserveRoom")
                .WithDescription("Reserve a room for a specific time slot and date")
                .Produces(StatusCodes.Status201Created)
                .Produces(StatusCodes.Status400BadRequest)
                .Produces(StatusCodes.Status409Conflict);

            return root;
        }

        private static async Task<IResult> GetAllRooms(ApplicationDbContext dbContext)
        {
            var rooms = await dbContext.Rooms.Include(r => r.Faculty).ToListAsync();
            return Results.Ok(rooms);
        }

        private static async Task<IResult> GetRoomsByFaculty(
            int facultyId,
            HttpContext httpContext,
            ApplicationDbContext dbContext)
        {
            var userRoleClaim = httpContext.User.FindFirst(ClaimTypes.Role);
            if (userRoleClaim == null)
            {
                return Results.BadRequest(new { message = "User role is missing from the token." });
            }

            var userRole = userRoleClaim.Value;

            IQueryable<RoomModel> query = dbContext.Rooms.Where(r => r.FacultyId == facultyId);

            if (userRole == "Student")
            {
                query = query.Where(r => r.RoomType == "Seminar"); // Restrict to Seminar rooms for Students
            }

            var rooms = await query.ToListAsync();

            if (!rooms.Any())
            {
                return Results.NotFound(new { message = "No rooms found for this faculty." });
            }

            return Results.Ok(rooms);
        }


        private static async Task<IResult> AddRoom([FromBody] RoomModel model, ApplicationDbContext dbContext)
        {
            if (string.IsNullOrWhiteSpace(model.Name) ||
                string.IsNullOrWhiteSpace(model.Description) ||
                string.IsNullOrWhiteSpace(model.RoomType) ||
                model.FacultyId <= 0)
            {
                return Results.BadRequest(new { message = "Name, Description, RoomType, and FacultyId are required." });
            }

            var facultyExists = await dbContext.Faculties.AnyAsync(f => f.Id == model.FacultyId);
            if (!facultyExists)
            {
                return Results.BadRequest(new { message = "Invalid FacultyId." });
            }

            var room = new RoomModel
            {
                Name = model.Name,
                Description = model.Description,
                RoomType = model.RoomType, // Assign RoomType
                FacultyId = model.FacultyId
            };

            dbContext.Rooms.Add(room);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/rooms/{room.Id}", room);
        }


        private static async Task<IResult> UpdateRoom(int id, [FromBody] RoomModel updatedRoom, ApplicationDbContext dbContext)
        {
            var room = await dbContext.Rooms.FindAsync(id);
            if (room == null)
            {
                return Results.NotFound(new { message = "Room not found." });
            }

            if (string.IsNullOrWhiteSpace(updatedRoom.Name) || string.IsNullOrWhiteSpace(updatedRoom.Description))
            {
                return Results.BadRequest(new { message = "Name and Description are required." });
            }

            room.Name = updatedRoom.Name;
            room.Description = updatedRoom.Description;
            room.FacultyId = updatedRoom.FacultyId;

            await dbContext.SaveChangesAsync();
            return Results.Ok(new { message = "Room updated successfully." });
        }

        private static async Task<IResult> DeleteRoom(int id, ApplicationDbContext dbContext)
        {
            var room = await dbContext.Rooms.FindAsync(id);
            if (room == null)
            {
                return Results.NotFound(new { message = "Room not found." });
            }

            dbContext.Rooms.Remove(room);
            await dbContext.SaveChangesAsync();

            return Results.Ok(new { message = "Room deleted successfully." });
        }

        private static async Task<IResult> GetUnavailableSlots(int roomId, DateTime date, ApplicationDbContext dbContext)
        {
            var unavailableSlots = await dbContext.Reservations
                .Where(r => r.RoomId == roomId && r.Date.Date == date.Date)
                .Select(r => r.TimeSlot)
                .ToListAsync();

            return Results.Ok(unavailableSlots);
        }

        private static async Task<IResult> ReserveRoom([FromBody] ReservationRequest model, HttpContext httpContext, ApplicationDbContext dbContext)
        {
            if (model.RoomId <= 0 || string.IsNullOrWhiteSpace(model.TimeSlot) || model.Date == DateTime.MinValue)
            {
                return Results.BadRequest(new { message = "RoomId, TimeSlot, and Date are required." });
            }

            var now = DateTime.UtcNow;

            if (model.Date.Date < now.Date || (model.Date.Date == now.Date && IsTimeSlotInPast(model.TimeSlot, now)))
            {
                return Results.BadRequest(new { message = "Reservations cannot be made for past dates or times." });
            }

            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Results.BadRequest(new { message = "UserId is missing from the token." });
            }

            var userId = userIdClaim.Value;

            var isTaken = await dbContext.Reservations.AnyAsync(r =>
                r.RoomId == model.RoomId &&
                r.Date.Date == model.Date.Date &&
                r.TimeSlot == model.TimeSlot);

            if (isTaken)
            {
                return Results.Conflict(new { message = "This time slot is already reserved." });
            }

            var reservation = new Reservation
            {
                RoomId = model.RoomId,
                Date = model.Date,
                TimeSlot = model.TimeSlot,
                UserId = userId
            };

            dbContext.Reservations.Add(reservation);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/reservations/{reservation.Id}", reservation);
        }

        // Helper method to check if the selected time slot is in the past
        private static bool IsTimeSlotInPast(string timeSlot, DateTime now)
        {
            var timeSlotParts = timeSlot.Split("-");
            if (timeSlotParts.Length != 2) return false;

            if (TimeSpan.TryParse(timeSlotParts[1], out var slotEndTime))
            {
                return now.TimeOfDay > slotEndTime;
            }

            return false;
        }
    }
}
