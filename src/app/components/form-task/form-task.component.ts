import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusTask, Task } from '@app/interfaces';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '@services/task-service.service';
import { NameValidator } from '@app/helpers/customs.validators';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-form-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss'],
})
export class FormTaskComponent implements OnInit {
  @Output() taskAdded = new EventEmitter<Task>();
  taskService = inject(TaskService);
  router = inject(Router);
  public taskSelected = signal<any>(null);
  taskForm!: FormGroup;
  protected readonly StatusTask = StatusTask;
  private fb = inject(FormBuilder);

  @Input() set id(taskId: string) {
    this.taskService.getTaskbyId(taskId).subscribe((task) => {
      if (task) {
        const { name, created_date, expire_date, description, status } = task;
        this.taskSelected.set(task);
        this.taskForm = this.fb.group({
          name: [name],
          description: [description],
          created_date: [created_date],
          expire_date: [expire_date],
          status: [status],
        });
        const nameControl = this.taskForm.get('name');
        nameControl?.valueChanges
          ?.pipe(switchMap((value) => this.taskService.isNameTaken(value)))
          .subscribe((value) => {
            nameControl?.setErrors({
              nameTaken: value != undefined,
            });
          });
      } else
        this.taskForm = this.fb.group({
          name: [
            '',
            [Validators.minLength(3), Validators.required],
            [NameValidator.createValidator(this.taskService)],
          ],
          description: ['', Validators.required],
          created_date: ['', Validators.required],
          expire_date: ['', Validators.required],
          status: [StatusTask.created, Validators.required],
        });
    });
  }

  ngOnInit() {
    this.datesValidation();
  }

  onSubmit() {
    if (this.taskForm.valid)
      if (!this.taskSelected()) {
        let id = new Date().getTime().toString();
        let obj = this.taskForm.value;
        const newTask: any = { ...obj, id };
        this.taskService.createTask(newTask);
      } else
        this.taskService.updateTask({
          ...this.taskForm.value,
          id: this.taskSelected().id,
        });
  }

  private datesValidation() {
    //Se puede hacer tambien de varias formas esta  es la implementacion mas basica.
    const created_date_control = this.taskForm.get('created_date');
    const expire_date_control = this.taskForm.get('expire_date');

    created_date_control?.valueChanges.subscribe((value) => {
      if (value != null && this.taskForm.get('expire_date')?.value != '') {
        const _expire_date_value = this.taskForm.get('expire_date')?.value;
        // @ts-ignore
        const expire_date_value = new Date(_expire_date_value);
        const created_date_value = new Date(value);
        if (created_date_value.getTime() > expire_date_value.getTime()) {
          created_date_control.setErrors({
            created_date_initial_invalid: true,
          });
        }
      }
    });

    expire_date_control?.valueChanges.subscribe((value) => {
      if (value != null && this.taskForm.get('expire_date')?.value != '') {
        const _created_date_value = this.taskForm.get('created_date')?.value;
        // @ts-ignore
        const created_date_value = new Date(_created_date_value);
        const expire_date_value = new Date(value);

        if (created_date_value.getTime() > expire_date_value.getTime()) {
          expire_date_control.setErrors({
            expire_date_initial_invalid: true,
          });
        }
      }
    });
  }
}
