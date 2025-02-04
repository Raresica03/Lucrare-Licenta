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
                return Results.BadRequest(new { message = "Parolele nu sunt asemanatoare." });
            }

            var existingUser = await userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return Results.BadRequest(new { message = "Email-ul este deja inregistrat. Te rog conecteaza-te" });
            }

            var validRoles = new List<string> { "Student", "Profesor", "Admin" };
            if (!validRoles.Contains(model.Role))
            {
                return Results.BadRequest(new { message = "Role invalid selectat" });
            }

            if (model.CardImage == null || model.CardImage.Length == 0)
            {
                return Results.BadRequest(new { message = "Te rog incarca o legitimatie valida" });
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Role = model.Role,
                IsApproved = false
            };

            using (var memoryStream = new MemoryStream())
            {
                await model.CardImage.CopyToAsync(memoryStream);
                user.CardImage = memoryStream.ToArray();
            }

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Results.Ok(new { message = "Utilizator inregistrat cu succes! Asteapta aprobarea unui admin." });
            }

            return Results.BadRequest(new { message = "Inregistrare esuata.", errors = result.Errors });
        }



        private static async Task<IResult> Login([FromBody] LoginModel model, UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return Results.BadRequest(new { message = "Email sau parola invalida." });
            }

            bool passwordValid = await userManager.CheckPasswordAsync(user, model.Password);
            if (!passwordValid)
            {
                return Results.BadRequest(new { message = "Email sau parola invalida." });
            }

            if (!user.IsApproved)
            {
                return Results.Json(new { message = "Contul tau inca nu a fost aprobat. Te rog asteapta aprobarea unui admin." }, statusCode: StatusCodes.Status401Unauthorized);
            }

            var authClaims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("UserId", user.Id),
                    new Claim("FirstName", user.FirstName),
                    new Claim("LastName", user.LastName)
                };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Results.Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                user = new
                {
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.Role
                }
            });
        }

    }
}
