using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using TaskAPIs.Data;
using TaskAPIs.Enums;
using TaskAPIs.Models;

namespace TaskAPIs.Services
{
    public class MigrationService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public MigrationService(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public void InitializeDatabase()
        {
            if (!_context.Database.CanConnect() || !_context.Database.GetService<IRelationalDatabaseCreator>().Exists())
            {
                _context.Database.EnsureCreated();
            }
            _context.Database.Migrate();

            // Seed initial data
            SeedData();
        }

        private void SeedData()
        {
            if (!_context.Users.Any())
            {
                var adminUser = new IdentityUser
                {
                    UserName = "admin@utm.com",
                    Email = "admin@utm.com",
                    EmailConfirmed = true
                };

                _userManager.CreateAsync(adminUser, "Admin@123").Wait();
            }

            if (!_context.TaskItems.Any())
            {
                _context.TaskItems.AddRange(new List<TaskItem>
            {
                    new TaskItem { Title = "Task 1", Description = "Description for task 1" , Status = TaskItemStatus.Completed, Priority = TaskItemPriority.Low, Start = DateTime.Parse("2024-07-11 10:00"), End = DateTime.Parse("2024-07-11 11:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                    new TaskItem { Title = "Task 2", Description = "Description for task 2" , Status = TaskItemStatus.New, Priority = TaskItemPriority.Low, Start = DateTime.Parse("2024-07-13 12:00"), End = DateTime.Parse("2024-07-15 12:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                    new TaskItem { Title = "Task 3", Description = "Description for task 3" , Status = TaskItemStatus.New, Priority = TaskItemPriority.Medium, Start = DateTime.Parse("2024-07-17 10:00"), End = DateTime.Parse("2024-07-18 11:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                    new TaskItem { Title = "Task 4", Description = "Description for task 4" , Status = TaskItemStatus.New, Priority = TaskItemPriority.High, Start = DateTime.Parse("2024-07-20 10:00"), End = DateTime.Parse("2024-07-20 11:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                    new TaskItem { Title = "Task 5", Description = "Description for task 5" , Status = TaskItemStatus.New, Priority = TaskItemPriority.Critical, Start = DateTime.Parse("2024-07-23 10:00"), End = DateTime.Parse("2024-07-23 11:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
            });
                _context.SaveChanges();
            }
        }
    }

}
