import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusTask, Task } from '@app/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss'],
})
export class FormTaskComponent {
  @Output() taskAdded = new EventEmitter<Task>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      created_date: [new Date(), Validators.required],
      expire_date: ['', Validators.required],
      status: [StatusTask.created, Validators.required],
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value;
      this.taskAdded.emit(newTask);
      this.taskForm.reset();
    }
  }
}
