import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskList } from '../task-list/task-list';
import { TaskForm } from '../task-form/task-form';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TaskItem } from '../../models/task-item';

type TaskFilter = 'all' | 'completed' | 'active';
type TaskSort = 'date-desc' | 'date-asc' | 'title-asc';
@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, TaskList, TaskForm],
  templateUrl: './task-dashboard.html',
  styleUrls: ['./task-dashboard.css']
})

export class TaskDashboard  implements OnInit {

private taskService = inject(TaskService);
private authService = inject(AuthService);
private router = inject(Router);

allTasks = signal<TaskItem[]>([]);
taskToEdit = signal<TaskItem | null>(null);
isLoading = signal<boolean>(false);
message = signal<string | null>(null);
messageType = signal<'success' | 'error' | null>(null);

// Modal state
isModalOpen = signal<boolean>(false);
modalMode = signal<'add' | 'edit'>('add');

currentFilter = signal<TaskFilter>('all');
currentSort = signal<TaskSort>('date-desc');

filteredTasks = computed(() => {
let tasks = this.allTasks();
const filter = this.currentFilter();
const sort = this.currentSort();

if(filter === 'active'){
  tasks = tasks.filter(task => !task.isCompleted);
}else if(filter === 'completed'){
  tasks = tasks.filter(task => task.isCompleted);
}

tasks.sort((a, b) => {
      if (sort === 'date-desc') {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      } else if (sort === 'date-asc') {
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      } else if (sort === 'title-asc') {
        return a.taskName.localeCompare(b.taskName);
      }
      return 0;
    });
 return tasks;
  });


ngOnInit(): void {
    this.loadTasks();
  }


  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        if (tasks && Array.isArray(tasks)) {
          this.allTasks.set(tasks);
        } else {
          this.allTasks.set([]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.allTasks.set([]);
        this.isLoading.set(false);
      }
    });
  }

  handleTaskSubmitted(task: TaskItem): void {
    if (this.taskToEdit()) {
      this.updateTaskFromForm(task);
    } else {
      this.createTask(task);
    }
  }

    createTask(task: TaskItem): void {
      this.taskService.createTask(task).subscribe({
        next: (newTask) => {
          // 💡 Update signal immutably: Add the new task to the array
          this.allTasks.update(tasks => [newTask, ...tasks]);
          this.messageType.set('success');
          this.message.set('Task created successfully.');
          setTimeout(() => { this.message.set(null); this.messageType.set(null); }, 3000);
          // Close modal after create
          this.closeModal();
        },
        error: (err) => console.error('Error creating task', err)
      });
    }

    // Update task from form submission (edit modal)
    updateTaskFromForm(task: TaskItem): void {
      this.taskService.updateTask(task).subscribe({
        next: (updatedTask) => {
          // 💡 Update signal immutably: Find and replace the task in the array
          // Use the original task if API returns null
          const taskToUpdate = updatedTask || task;
          this.allTasks.update(tasks => 
            tasks.map(t => t.id === taskToUpdate.id ? taskToUpdate : t)
          );
          this.messageType.set('success');
          this.message.set('Task updated successfully.');
          setTimeout(() => { this.message.set(null); this.messageType.set(null); }, 3000);
          // Close modal and clear edit state
          this.closeModal();
          this.clearEditState();
        },
        error: (err) => {
          console.error('Error updating task', err);
          this.messageType.set('error');
          this.message.set('Failed to update task.');
          setTimeout(() => { this.message.set(null); this.messageType.set(null); }, 3000);
        }
      });
    }
    
    // Update task (for toggle completion from list)
    updateTask(task: TaskItem): void {
    this.taskService.updateTask(task).subscribe({
      next: (updatedTask) => {
        // 💡 Update signal immutably: Find and replace the task in the array
        // Use the original task if API returns null
        const taskToUpdate = updatedTask || task;
        this.allTasks.update(tasks => 
          tasks.map(t => t.id === taskToUpdate.id ? taskToUpdate : t)
        );
        this.messageType.set('success');
        this.message.set('Task status updated.');
        setTimeout(() => { this.message.set(null); this.messageType.set(null); }, 3000);
      },
      error: (err) => console.error('Error updating task', err)
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        // 💡 Update signal immutably: Remove the deleted task from the array
        this.allTasks.update(tasks => tasks.filter(t => t.id !== id));
        // Ensure the deleted task isn't the one currently being edited
        if (this.taskToEdit()?.id === id) {
          this.clearEditState();
        }
        this.messageType.set('success');
        this.message.set('Task deleted.');
        setTimeout(() => { this.message.set(null); this.messageType.set(null); }, 3000);
      },
      error: (err) => console.error('Error deleting task', err)
    });
  }

  setTaskToEdit(task: TaskItem): void {
      this.openEditModal(task);
  }

  clearEditState(): void {
    this.taskToEdit.set(null);
  }

  // Modal helpers
  openAddModal(): void {
    this.clearEditState();
    this.modalMode.set('add');
    this.isModalOpen.set(true);
  }

  openEditModal(task: TaskItem): void {
    this.taskToEdit.set(task);
    this.modalMode.set('edit');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  updateFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskFilter;
    this.currentFilter.set(value);
  }

  updateSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskSort;
    this.currentSort.set(value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
