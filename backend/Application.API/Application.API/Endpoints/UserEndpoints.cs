using Application.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Application.API.Endpoints
{
    public static class UserEndpoints
    {
        public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder builder)
        {
            var root = builder.MapGroup("/user")
                              .WithTags("User")
                              .WithDescription("Endpoints for user-specific actions like reservation history")
                              .WithOpenApi();

            root.MapGet("/reservations", GetUserReservations)
                .WithName("GetUserReservations")
                .WithDescription("Retrieve all reservations for the logged-in user")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status401Unauthorized);

            root.MapGet("/reservations/{reservationId}", GetReservationById)
                .WithName("GetReservationById")
                .WithDescription("Retrieve a specific reservation by ID")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            root.MapDelete("/reservations/{reservationId}", CancelReservation)
                .WithName("CancelReservation")
                .WithDescription("Cancel a specific reservation by ID")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);

            return root;
        }

        private static async Task<IResult> GetUserReservations(HttpContext httpContext, ApplicationDbContext dbContext)
        {
            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Results.Json(new { message = "User ID is missing from the token." }, statusCode: StatusCodes.Status401Unauthorized);
            }

            var userId = userIdClaim.Value;

            var reservations = await dbContext.Reservations
                .Include(r => r.Room) // Include the Room associated with the reservation
                .ThenInclude(room => room.Faculty) // Include the Faculty associated with the Room
                .Where(r => r.UserId == userId) // Filter reservations by the current user
                .OrderBy(r => r.Date) // Order by date
                .Select(r => new
                {
                    r.Id,
                    r.Date,
                    r.TimeSlot,
                    RoomName = r.Room.Name,
                    r.Room.RoomType, // Assuming the type is stored in the Room's description
                    FacultyName = r.Room.Faculty.Name // Fetch faculty name from the related Faculty entity
                })
                .ToListAsync();

            return Results.Ok(reservations);
        }

        private static async Task<IResult> GetReservationById(int reservationId, HttpContext httpContext, ApplicationDbContext dbContext)
        {
            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Results.Json(new { message = "User ID is missing from the token." }, statusCode: StatusCodes.Status401Unauthorized);
            }

            var userId = userIdClaim.Value;

            var reservation = await dbContext.Reservations
                .Include(r => r.Room)
                .ThenInclude(room => room.Faculty)
                .FirstOrDefaultAsync(r => r.Id == reservationId && r.UserId == userId);

            if (reservation == null)
            {
                return Results.NotFound(new { message = "Reservation not found." });
            }

            return Results.Ok(reservation);
        }

        private static async Task<IResult> CancelReservation(int reservationId, HttpContext httpContext, ApplicationDbContext dbContext)
        {
            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Results.Json(new { message = "User ID is missing from the token." }, statusCode: StatusCodes.Status401Unauthorized);
            }

            var userId = userIdClaim.Value;

            var reservation = await dbContext.Reservations
                .FirstOrDefaultAsync(r => r.Id == reservationId);

            if (reservation == null)
            {
                return Results.NotFound(new { message = "Reservation not found." });
            }

            dbContext.Reservations.Remove(reservation);
            await dbContext.SaveChangesAsync();

            return Results.Ok(new { message = "Reservation canceled successfully." });
        }
    }
}
