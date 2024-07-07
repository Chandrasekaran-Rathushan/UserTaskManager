using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskAPIs.Models.Dtos;
using TaskAPIs.Services.IServices;
using System.Security.Claims;
using TaskAPIs.Enums;

namespace TaskAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskItemController : ControllerBase
    {
        private readonly ITaskItemService _taskService;
        private readonly UserManager<IdentityUser> _userManager;

        public TaskItemController(ITaskItemService taskService, UserManager<IdentityUser> userManager)
        {
            _taskService = taskService;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] DateTime? start = null, 
            DateTime? end = null, 
            string? status = null, 
            string? priority = null,
            string? title = null
            )
        {
            var tasks = await _taskService.GetAllTasksAsync(start, end, status, priority, title);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(TaskItemPayloadDto taskDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var createdTask = await _taskService.CreateTaskAsync(taskDto, user.Id);
            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItemPayloadDto task)
        {
            var updatedTask = await _taskService.UpdateTaskAsync(id, task);
            return Ok(updatedTask);
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeleteTask(int id)
        {
            var result = await _taskService.DeleteTaskAsync(id);
           
            return result;
        }

        [HttpGet("statuses")]
        public IActionResult GetTaskStatuses()
        {
            var statuses = Enum.GetValues(typeof(TaskItemStatus))
                .Cast<TaskItemStatus>()
                .Select(t => new { key = t.ToString(), value = (int)t })
                .ToList();
            return Ok(statuses);
        }

        [HttpGet("priorities")]
        public IActionResult GetTaskPriorities()
        {
            var priorities = Enum.GetValues(typeof(TaskItemPriority))
                .Cast<TaskItemPriority>()
                .Select(t => new { key = t.ToString(), value = (int)t })
                .ToList();
            return Ok(priorities);
        }

        [HttpPatch("{id}/update-priority")]
        public async Task<bool> UpdateTaskPriority(int id, TaskItemPriority priority)
        {
            return await _taskService.UpdateTaskPriority(id, priority);
        }

        [HttpPatch("{id}/update-status")]
        public async Task<bool> UpdateTaskStatus(int id, TaskItemStatus status)
        {
            return await _taskService.UpdateTaskStatus(id, status);
        }
    }
}
