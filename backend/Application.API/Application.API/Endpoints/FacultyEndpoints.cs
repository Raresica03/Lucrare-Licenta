using Application.API.Data;
using Application.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Application.API.Endpoints
{
    public static class FacultyEndpoints
    {
        public static RouteGroupBuilder MapFacultyEndpoints(this RouteGroupBuilder builder)
        {
            var root = builder.MapGroup("/faculties")
                              .WithTags("Faculties")
                              .WithDescription("Endpoints for managing faculties")
                              .WithOpenApi();

            root.MapGet("/getFaculties", GetAllFaculties)
                .WithName("GetAllFaculties")
                .WithDescription("Retrieve all faculties")
                .Produces(StatusCodes.Status200OK);

            root.MapPost("/addFaculty", AddFaculty)
                .WithName("AddFaculty")
                .WithDescription("Add a new faculty")
                .Produces(StatusCodes.Status201Created)
                .Produces(StatusCodes.Status400BadRequest)
                .RequireAuthorization(policy => policy.RequireRole("Admin"));

            root.MapPut("/updateFaculty/{id}", UpdateFaculty)
                .WithName("UpdateFaculty")
                .WithDescription("Update an existing faculty")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound)
                .Produces(StatusCodes.Status400BadRequest)
                 .RequireAuthorization(policy => policy.RequireRole("Admin"));

            root.MapDelete("/deleteFaculty/{id}", DeleteFaculty)
                .WithName("DeleteFaculty")
                .WithDescription("Delete a faculty by ID")
                .Produces(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound)
                .RequireAuthorization(policy => policy.RequireRole("Admin"));
            return root;
        }

        private static async Task<IResult> GetAllFaculties(ApplicationDbContext dbContext)
        {
            var faculties = await dbContext.Faculties.ToListAsync();
            return Results.Ok(faculties);
        }

        private static async Task<IResult> AddFaculty([FromBody] FacultyModel model, ApplicationDbContext dbContext)
        {
            if (string.IsNullOrWhiteSpace(model.Name) || string.IsNullOrWhiteSpace(model.Description))
            {
                return Results.BadRequest(new { message = "Name and Description are required." });
            }

            var faculty = new FacultyModel
            {
                Name = model.Name,
                Description = model.Description
            };

            dbContext.Faculties.Add(faculty);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/faculties/{faculty.Id}", faculty);
        }

        private static async Task<IResult> UpdateFaculty(int id, FacultyModel updatedFaculty, ApplicationDbContext dbContext)
        {
            var faculty = await dbContext.Faculties.FindAsync(id);
            if (faculty == null)
            {
                return Results.NotFound(new { message = "Faculty not found." });
            }

            if (string.IsNullOrWhiteSpace(updatedFaculty.Name) || string.IsNullOrWhiteSpace(updatedFaculty.Description))
            {
                return Results.BadRequest(new { message = "Name and Description are required." });
            }

            faculty.Name = updatedFaculty.Name;
            faculty.Description = updatedFaculty.Description;

            await dbContext.SaveChangesAsync();
            return Results.Ok(new { message = "Faculty updated successfully." });
        }

        private static async Task<IResult> DeleteFaculty(int id, ApplicationDbContext dbContext)
        {
            var faculty = await dbContext.Faculties.FindAsync(id);
            if (faculty == null)
            {
                return Results.NotFound(new { message = "Faculty not found." });
            }

            dbContext.Faculties.Remove(faculty);
            await dbContext.SaveChangesAsync();

            return Results.Ok(new { message = "Faculty deleted successfully." });
        }
    }
}
