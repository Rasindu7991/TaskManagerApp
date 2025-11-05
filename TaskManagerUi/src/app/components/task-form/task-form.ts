import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskItem } from '../../models/task-item';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css'],
})

export class TaskForm {
 private formBuilder = inject(FormBuilder); 
  taskToEdit = input<TaskItem | null>(null);

@Output() taskSubmitted = new EventEmitter<TaskItem>();
@Output() cancelEdit = new EventEmitter<void>();

taskForm = this.formBuilder.group({
  id: [0],
  taskName: ['',[Validators.required, Validators.maxLength(100)]],
  description: ['',[Validators.maxLength(500)]],
  isCompleted: [false],
  createdDate: [new Date()]
});

isEditMode = computed(() => !!this.taskToEdit());

constructor() {
    effect(() => {
        const task = this.taskToEdit();
        if (task) {
            // Patch the form with the existing task data for editing
            this.taskForm.patchValue(task as TaskItem);
        } else {
            // Reset the form if the parent clears the selected task
            this.resetForm(false); 
        }
    });
  }

onSubmit(): void{
  if(this.taskForm.valid){
    this.taskSubmitted.emit(this.taskForm.getRawValue() as TaskItem);

    if(!this.isEditMode()){
      this.resetForm();
    }
  }
}

onCancelEdit(): void{
  this.resetForm(true);
}

resetForm(emitCancel: boolean = false){
this.taskForm.reset({
  id:0,
  taskName: '',
  description: '',
  isCompleted: false,
  createdDate: new Date()

});

if(emitCancel){
    this.cancelEdit.emit();
}

}
}
