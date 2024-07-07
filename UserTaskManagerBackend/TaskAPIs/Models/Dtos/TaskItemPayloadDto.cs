using System.ComponentModel.DataAnnotations;
using TaskAPIs.Enums;

namespace TaskAPIs.Models.Dtos
{
    public class TaskItemPayloadDto
    {
        [Required]
        [Display(Name = "Task Tile")]
        public string Title { get; set; }
        [Display(Name = "Task Description")]
        public string Description { get; set; }
        [Required]
        [Display(Name = "Start Date")]
        public DateTime Start { get; set; }
        [Required]
        [Display(Name = "End Date")]
        public DateTime End { get; set; }

        [Display(Name = "Task Status")]
        public TaskItemStatus Status { get; set; } = TaskItemStatus.New;
        [Display(Name = "Task Priority")]
        public TaskItemPriority Priority { get; set; } = TaskItemPriority.Low;

        public TaskItem ToTaskItem()
        {
            return new TaskItem
            { 
                Title = Title,
                Description = Description,
                Priority = Priority,
                Status = Status,
                Start = Start,
                End = End,
            };
        }
    }
}
