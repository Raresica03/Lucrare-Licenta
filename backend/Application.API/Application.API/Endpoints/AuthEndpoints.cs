using Application.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.API.Endpoints
{
    public static class AuthEndpoints
    {
        public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder builder)
        {
            var root = builder.MapGroup("/auth")
                              .WithTags("Auth")
                              .WithDescription("Authentication and Authorization endpoints")
                              .WithOpenApi();

            root.MapPost("/register", Register)
                .WithName("Register")
                .WithDescription("Register a new user")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status400BadRequest)
                .DisableAntiforgery();

            root.MapPost("/login", Login)
                .WithName("Login")
                .WithDescription("Login an existing user")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status401Unauthorized)
                .Produces(StatusCodes.Status400BadRequest)
                .DisableAntiforgery();

            return root;
        }

        private static async Task<IResult> Register([FromForm] RegisterModel model, UserManager<ApplicationUser> userManager)
        {
            if (model.Password != model.ConfirmPassword)
            {
                return Results.BadRequest(new { message = "Passwords do not match." });
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,  // Ensure these values are being set
                LastName = model.LastName,    // Ensure these values are being set
                Role = model.Role,
                IsApproved = false // Default to not approved
            };

            using (var memoryStream = new MemoryStream())
            {
                await model.CardImage.CopyToAsync(memoryStream);
                user.CardImage = memoryStream.ToArray();
            }

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Results.Ok(new { message = "User registered successfully! Awaiting approval." });
            }

            return Results.BadRequest(result.Errors);
        }


        private static async Task<IResult> Login([FromBody] LoginModel model, UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            var user = await userManager.FindByNameAsync(model.Email);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                // Check if the user is approved
                if (!user.IsApproved)
                {
                    return Results.Json(new { message = "Your account has not been approved yet." }, statusCode: StatusCodes.Status401Unauthorized);
                }

                var authClaims = new[]
                {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: configuration["JWT:ValidIssuer"],
                    audience: configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                // Include the user details in the response along with the token
                return Results.Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    user = new
                    {
                        user.FirstName, // Assuming you have these properties in your ApplicationUser model
                        user.LastName,
                        user.Email,
                        user.Role
                    }
                });
            }
            return Results.Unauthorized();
        }
    }
}
