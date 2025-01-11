using Application.API.Data;
using Application.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Application.API.Endpoints
{
    public static class RoomEndpoints
    {
        public static RouteGroupBuilder MapRoomEndpoints(this RouteGroupBuilder builder)
        {
            var root = builder.MapGroup("/rooms")
                              .WithTags("Rooms")
                              .WithDescription("Endpoints for managing rooms")
                              .WithOpenApi();

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

            return root;
        }

        private static async Task<IResult> GetAllRooms(ApplicationDbContext dbContext)
        {
            var rooms = await dbContext.Rooms.Include(r => r.Faculty).ToListAsync();
            return Results.Ok(rooms);
        }

        private static async Task<IResult> GetRoomsByFaculty(int facultyId, ApplicationDbContext dbContext)
        {
            var rooms = await dbContext.Rooms
                .Where(r => r.FacultyId == facultyId)
                .ToListAsync();

            if (!rooms.Any())
            {
                return Results.NotFound(new { message = "No rooms found for this faculty." });
            }

            return Results.Ok(rooms);
        }

        private static async Task<IResult> AddRoom([FromBody] RoomModel model, ApplicationDbContext dbContext)
        {
            if (string.IsNullOrWhiteSpace(model.Name) || string.IsNullOrWhiteSpace(model.Description) || model.FacultyId <= 0)
            {
                return Results.BadRequest(new { message = "Name, Description, and FacultyId are required." });
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
    }
}
