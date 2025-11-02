using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerApi.Data;
using TaskManagerApi.Filters;
using TaskManagerApi.Models;

namespace TaskManagerApi.Controllers
{
    [ServiceFilter(typeof(ApiKeyAuthFiter))]
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TaskItemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetAllTaskItems()
        {
            return await _context.TaskItems.OrderByDescending(t => t.CreatedDate).ToListAsync();

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTaskItem(int id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null)
            {
                return NotFound();
            }
            return taskItem;
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTaskItem(TaskItem taskItem)
        {
            taskItem.CreatedDate = DateTime.Now;
            _context.TaskItems.Add(taskItem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTaskItem), new { id = taskItem.Id }, taskItem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskItem(int id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null)
            {
                return NotFound();
            }
            _context.TaskItems.Remove(taskItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaskItem(int id, TaskItem taskitem)
        {
            if (id != taskitem.Id)
            {
                return BadRequest();
            }
            _context.Entry(taskitem).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!_context.TaskItems.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }
    }
}
