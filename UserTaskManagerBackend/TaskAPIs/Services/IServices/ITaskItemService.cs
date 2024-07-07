using TaskAPIs.Enums;
using TaskAPIs.Models;
using TaskAPIs.Models.Dtos;

namespace TaskAPIs.Services.IServices
{
    public interface ITaskItemService
    {
        Task<IEnumerable<TaskItem>> GetAllTasksAsync(DateTime? start, DateTime? end, string status, string priority, string title);
        Task<TaskItem> GetTaskByIdAsync(int id);
        Task<TaskItem> CreateTaskAsync(TaskItemPayloadDto task, string userId);
        Task<TaskItem> UpdateTaskAsync(int id, TaskItemPayloadDto task);
        Task<bool> DeleteTaskAsync(int id);

        Task<bool> UpdateTaskPriority(int id, TaskItemPriority priority);
        Task<bool> UpdateTaskStatus(int id, TaskItemStatus status);
    }
}
