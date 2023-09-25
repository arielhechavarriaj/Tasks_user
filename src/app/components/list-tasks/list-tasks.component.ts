import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { StatusTask, Task } from '@app/interfaces';
import { TaskService } from '@services/task-service.service';
import Swal from 'sweetalert2';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit {
  tasks: Task[] = [];
  filterStatus = '';
  nameFilter = '';
  filteredTasks: Task[] = [];
  taskService = inject(TaskService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  route = inject(Router);
  colorStatusMap = new Map();
  taskForm: FormGroup = this.fb.group({
    filterName: [''],
    filterStatus: [''],
    searchServer: [true],
  });

  page = '1';
  start = '0';
  limit = '100';
  filterName = '';
  loading = false;
  notData = false;
  protected readonly StatusTask = StatusTask;
  private searchServer: boolean = false;

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.loadTaks();

    this.taskForm.controls['filterName'].valueChanges.subscribe((value) => {
      this.nameFilter = value;
      this.filterTasks();
    });
    this.taskForm.controls['filterStatus'].valueChanges.subscribe((value) => {
      this.filterStatus = value;
      this.filterTasks();
    });

    this.colorStatusMap.set(StatusTask.created, 'badge text-bg-warning');
    this.colorStatusMap.set(StatusTask.inProgress, 'badge text-bg-primary');
    this.colorStatusMap.set(StatusTask.done, 'badge text-bg-success');
    this.colorStatusMap.set(StatusTask.incomplete, 'text-bg badge-danger');
  }

  loadTaks() {
    this.loading = true;
    this.taskService
      .getTasks(
        this.page,
        this.start,
        this.limit,
        this.filterStatus,
        this.filterName,
      )
      .subscribe((tasks) => {
        this.tasks = tasks;
        this.loading = false;
        this.notData = tasks.length === 0;
        this.filterTasks();
      });
  }

  trackByTask(index: number, item: Task): string {
    return item.id;
  }

  /**
   * Función para mostrar la tarea en progreso más antigua en un SweetAlert
   */
  showOldestInProgressTask(): void {
    const oldestInProgressTasks = this.filteredTasks.filter(
      (task) => task.status === StatusTask.inProgress,
    );

    if (oldestInProgressTasks.length === 0) {
      Swal.fire('No hay tareas en Progreso', '', 'info').then();
      return;
    }

    const oldestTask = oldestInProgressTasks.reduce((prev, current) => {
      const prevDate = new Date(prev.created_date);
      const currentDate = new Date(current.created_date);
      return prevDate < currentDate ? prev : current;
    });

    Swal.fire({
      title: 'Tarea más antigua en Progreso',
      html: `
        <strong>Nombre:</strong> ${oldestTask.name}<br>
        <strong>Descripción:</strong> ${oldestTask.description}<br>
        <strong>Fecha de Creación:</strong> ${new Date(
          oldestTask.created_date,
        ).toLocaleDateString()}<br>
        <strong>Fecha Límite:</strong> ${new Date(
          oldestTask.expire_date,
        ).toLocaleDateString()}
      `,
      icon: 'info',
    }).then();
  }

  /**
   * Mostrar la tareas que hayan expirado
   */
  showExpiredTasks(): void {
    const currentDate = new Date();
    const expiredTasks = this.filteredTasks.filter(
      (task) => new Date(task.expire_date) < currentDate,
    );

    if (expiredTasks.length === 0) {
      Swal.fire('No hay tareas vencidas', '', 'info').then();
      return;
    }

    const expiredTasksList = expiredTasks
      .map(
        (task) =>
          `${task.name} - Fecha de vencimiento: ${new Date(
            task.expire_date,
          ).toLocaleDateString()}`,
      )
      .join('<br>');

    Swal.fire({
      title: 'Tareas Vencidas',
      html: expiredTasksList,
      icon: 'warning',
    }).then();
  }

  /**
   * Filtrar las tareas
   */
  filterTasks(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const stateMatch =
        this.filterStatus === '' || task.status === this.filterStatus;
      const nameMatch =
        task.name.toLowerCase().includes(this.nameFilter.toLowerCase()) ||
        this.nameFilter === '';

      return stateMatch && nameMatch;
    });
  }

  onNewTask() {
    this.route.navigateByUrl('/formTask/').then();
  }

  onViewTask(task: Task) {
    this.route.navigateByUrl(`/formTask/${task.id}`).then();
  }
}
