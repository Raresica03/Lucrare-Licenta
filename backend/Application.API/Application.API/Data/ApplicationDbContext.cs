using Application.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Application.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<FacultyModel> Faculties { get; set; }
        public DbSet<RoomModel> Rooms { get; set; }
        public DbSet<Reservation> Reservations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Faculty to Room relationship
            modelBuilder.Entity<RoomModel>()
                .HasOne(r => r.Faculty)
                .WithMany(f => f.Rooms)
                .HasForeignKey(r => r.FacultyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Room to Reservation relationship
            modelBuilder.Entity<Reservation>()
                .HasOne(reservation => reservation.Room)
                .WithMany(room => room.Reservations)
                .HasForeignKey(reservation => reservation.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // User to Reservation relationship
            modelBuilder.Entity<Reservation>()
                .HasOne(reservation => reservation.User)
                .WithMany()
                .HasForeignKey(reservation => reservation.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascading delete on User
        }
    }
}
