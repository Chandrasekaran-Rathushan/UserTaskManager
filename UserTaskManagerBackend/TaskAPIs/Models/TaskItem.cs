using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskAPIs.Enums;

namespace TaskAPIs.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
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
        [Required]
        [Display(Name = "Task Status")]
        public TaskItemStatus Status { get; set; }
        [Required]
        [Display(Name = "Task Priority")]
        public TaskItemPriority Priority { get; set; }

        [NotMapped]
        public string Color
        {
            get => GetTaskColor();
            private set { } 
        }

        private string GetTaskColor()
        {
            if (Status == TaskItemStatus.Completed)
            {
                return "clsStatusCompletedGreen";
            }

            var currentDate = DateTime.UtcNow;

            if (End < currentDate && Status != TaskItemStatus.Completed)
            {
                return "clsCriticalPriorityRed";
            }

            return Priority switch
            {
                TaskItemPriority.Low => "clsLowPriorityBlue",
                TaskItemPriority.Medium => "clsMediumPriorityYellow",
                TaskItemPriority.High => "clsHighPriorityOrange",
                TaskItemPriority.Critical => "clsCriticalPriorityRed",
                _ => "Gray"
            };
        }

        public DateTime CreatedDateTime { get; set; }
        public DateTime LastUpdatedDateTime { get; set; }
    }
}
