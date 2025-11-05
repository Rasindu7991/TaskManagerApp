import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskItem } from '../../models/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskList {
  @Input() tasks: TaskItem[] = [];
  @Output() taskToggleCompleted = new EventEmitter<TaskItem>();
  @Output() taskEdit = new EventEmitter<TaskItem>();
  @Output() taskDelete = new EventEmitter<number>();


  onToggle(task: TaskItem): void{
    const updatedTask: TaskItem = {
      ...task,
      isCompleted: !task.isCompleted
    };
    this.taskToggleCompleted.emit(updatedTask);
  }

  onEdit(task: TaskItem): void {
    this.taskEdit.emit(task);
  }

  onDelete(id: number): void {
      this.taskDelete.emit(id);
    }


}
