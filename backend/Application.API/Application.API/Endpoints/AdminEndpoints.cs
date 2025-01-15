using Application.API.Data;
using Application.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.API.Endpoints
{
    public static class AdminEndpoints
    {
        public static RouteGroupBuilder MapAdminEndpoints(this RouteGroupBuilder builder)
        {
            var root = builder.MapGroup("/admin")
                              .WithTags("Admin")
                              .WithDescription("Admin management endpoints")
                              .WithOpenApi();

            root.MapGet("/pending-users", GetPendingUsers)
                .WithName("GetPendingUsers")
                .WithDescription("Fetch all users pending approval")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status401Unauthorized)
                .DisableAntiforgery();

            root.MapPost("/approve-user/{userId}", ApproveUser)
                .WithName("ApproveUser")
                .WithDescription("Approve a pending user")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound)
                .Produces(StatusCodes.Status401Unauthorized)
                .DisableAntiforgery();

            root.MapGet("/reservations", GetAllReservations)
                .WithName("GetAllReservations")
                .WithDescription("Fetch all reservations for Admin")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status401Unauthorized)
                .RequireAuthorization(policy => policy.RequireRole("Admin"));

            return root;
        }

        private static async Task<IResult> GetPendingUsers(UserManager<ApplicationUser> userManager)
        {
            var pendingUsers = await userManager.Users
                .Where(u => u.IsApproved == false)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.Role,
                    CardImage = u.CardImage != null ? Convert.ToBase64String(u.CardImage) : null
                })
                .ToListAsync();

            return Results.Ok(pendingUsers);
        }

        private static async Task<IResult> ApproveUser(string userId, UserManager<ApplicationUser> userManager)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Results.NotFound(new { message = "User not found." });
            }

            user.IsApproved = true;
            var result = await userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Results.Ok(new { message = "User approved successfully." });
            }

            return Results.BadRequest(result.Errors);
        }

        private static async Task<IResult> GetAllReservations(ApplicationDbContext dbContext)
        {
            var reservations = await dbContext.Reservations
        .Include(r => r.Room) // Include the Room associated with the reservation
        .ThenInclude(room => room.Faculty) // Include the Faculty associated with the Room
        .Include(r => r.User) // Include the User associated with the reservation
        .OrderBy(r => r.Date) // Order by date
        .Select(r => new
        {
            r.Id,
            r.Date,
            r.TimeSlot,
            RoomName = r.Room.Name,
            r.Room.RoomType, // Assuming the type is stored in the Room's description
            FacultyName = r.Room.Faculty.Name, // Fetch faculty name from the related Faculty entity
            User = new
            {
                r.User.Id,
                r.User.FirstName,
                r.User.LastName
            }
        })
        .ToListAsync();

            return Results.Ok(reservations);
        }
    }
}
