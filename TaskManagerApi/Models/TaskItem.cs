namespace TaskManagerApi.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string TaskName { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public int AsigneeeId { get; set; }

    }
}
