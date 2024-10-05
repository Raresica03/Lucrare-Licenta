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
                    u.Role,  // Include the role the user is requesting
                    CardImage = u.CardImage != null ? Convert.ToBase64String(u.CardImage) : null // Convert image to base64 string
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
    }
}
