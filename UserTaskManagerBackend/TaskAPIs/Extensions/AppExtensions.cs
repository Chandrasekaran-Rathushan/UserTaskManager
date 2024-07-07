using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskAPIs.Data;
using TaskAPIs.Enums;
using TaskAPIs.Models;

namespace TaskAPIs.Extensions
{
    public static class AppExtensions
    {
        public static void ApplyMigrations(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                context.Database.EnsureCreated();
                context.Database.Migrate();
            }
        }

        public static void SeedData(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                // Add admin user if not exists
                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                if (!context.Users.Any())
                {
                    var adminUser = new IdentityUser
                    {
                        UserName = "admin@utm.com",
                        Email = "admin@utm.com",
                        EmailConfirmed = true
                    };

                    userManager.CreateAsync(adminUser, "Admin@123").Wait();
                }

                // Add default tasks if not exists
                if (!context.TaskItems.Any())
                {
                    context.TaskItems.AddRange(new List<TaskItem>
                {
                    new TaskItem { Title = "Task 1", Description = "Description for task 1" , Status = TaskItemStatus.Completed, Priority = TaskItemPriority.Low, Start = DateTime.Parse("2024-07-11 10:00"), End = DateTime.Parse("2024-07-11 11:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                    new TaskItem { Title = "Task 2", Description = "Description for task 2" , Status = TaskItemStatus.New, Priority = TaskItemPriority.Low, Start = DateTime.Parse("2024-07-13 12:00"), End = DateTime.Parse("2024-07-15 12:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                    new TaskItem { Title = "Task 3", Description = "Description for task 3" , Status = TaskItemStatus.New, Priority = TaskItemPriority.Medium, Start = DateTime.Parse("2024-07-17 10:00"), End = DateTime.Parse("2024-07-18 11:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                    new TaskItem { Title = "Task 4", Description = "Description for task 4" , Status = TaskItemStatus.New, Priority = TaskItemPriority.High, Start = DateTime.Parse("2024-07-20 10:00"), End = DateTime.Parse("2024-07-20 11:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                    new TaskItem { Title = "Task 5", Description = "Description for task 5" , Status = TaskItemStatus.New, Priority = TaskItemPriority.Critical, Start = DateTime.Parse("2024-07-23 10:00"), End = DateTime.Parse("2024-07-23 11:00"), CreatedDateTime = DateTime.UtcNow, LastUpdatedDateTime = DateTime.UtcNow},
                });
                    context.SaveChanges();
                }
            }
        }
    }
}
