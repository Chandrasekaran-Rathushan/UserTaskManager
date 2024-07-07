using Microsoft.EntityFrameworkCore;
using TaskAPIs.Data;
using TaskAPIs.Enums;
using TaskAPIs.Models;
using TaskAPIs.Models.Dtos;
using TaskAPIs.Services.IServices;

namespace TaskAPIs.Services
{
    public class TaskItemService : ITaskItemService
    {
        private readonly ApplicationDbContext _context;

        public TaskItemService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync(DateTime? start, DateTime? end, string status, string priority, string title)
        {
            IQueryable<TaskItem> query = _context.TaskItems.AsQueryable();

            // Apply filters 
            if (start.HasValue)
            {
                query = query.Where(task => task.Start >= start.Value);
            }

            if (end.HasValue)
            {
                query = query.Where(task => task.End <= end.Value);
            }

            if (!string.IsNullOrEmpty(status))
            {
                var statusArray = status.Split(',').Select(s => (TaskItemStatus)Enum.Parse(typeof(TaskItemStatus), s));
                query = query.Where(task => statusArray.Contains(task.Status));
            }

            if (!string.IsNullOrEmpty(priority))
            {
                var priorityArray = priority.Split(',').Select(p => (TaskItemPriority)Enum.Parse(typeof(TaskItemPriority), p));
                query = query.Where(task => priorityArray.Contains(task.Priority));
            }

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(task => task.Title.Contains(title));
            }

            return await query.ToListAsync();
        }

        public async Task<TaskItem> GetTaskByIdAsync(int id)
        {
            return await _context.TaskItems.FindAsync(id);
        }

        public async Task<TaskItem> CreateTaskAsync(TaskItemPayloadDto createTaskDto, string userId)
        {
            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                Start = createTaskDto.Start,
                End = createTaskDto.End,
                Status = createTaskDto.Status,
                Priority = createTaskDto.Priority,
                CreatedDateTime = DateTime.UtcNow,
                LastUpdatedDateTime = DateTime.UtcNow
            };

            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<TaskItem> UpdateTaskAsync(int id, TaskItemPayloadDto o)
        {
            var existingTask = await _context.TaskItems.FindAsync(id);

            if (existingTask == null)
            {
                return null;
            }

            existingTask.Title = o.Title;
            existingTask.Description = o.Description;
            existingTask.Start = o.Start;
            existingTask.End = o.End;
            existingTask.Status = o.Status;
            existingTask.Priority = o.Priority;
            existingTask.LastUpdatedDateTime = DateTime.UtcNow;

            _context.TaskItems.Update(existingTask);
            await _context.SaveChangesAsync();
            return existingTask;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task == null)
            {
                return false;
            }

            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTaskPriority(int id, TaskItemPriority priority)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task == null)
            {
                return false;
            }

            task.Priority = priority;
            task.LastUpdatedDateTime = DateTime.UtcNow;

            _context.TaskItems.Update(task);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateTaskStatus(int id, TaskItemStatus status)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task == null)
            {
                return false;
            }

            task.Status = status;
            task.LastUpdatedDateTime = DateTime.UtcNow;

            _context.TaskItems.Update(task);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
