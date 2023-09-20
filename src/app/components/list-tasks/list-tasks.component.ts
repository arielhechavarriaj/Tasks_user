import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  selectedState = '';
  nameFilter = '';
  filteredTasks!: Task[];
  taskService = inject(TaskService);
  authService = inject(AuthService);
  route = inject(Router);

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.filterTasks();
    });
  }

  /**
   * Filtrar las tareas
   */
  filterTasks(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const stateMatch =
        this.selectedState === '' || task.status === this.selectedState;
      const nameMatch =
        task.name.toLowerCase().includes(this.nameFilter.toLowerCase()) ||
        this.nameFilter === '';

      return stateMatch && nameMatch;
    });
  }

  /**
   * Obtener la clase CSS para las etiquetas de estado (Badge)
   * @param status
   */

  getBadgeClass(status: StatusTask): string {
    switch (status) {
      case StatusTask.created:
        return 'badge badge-warning';
      case StatusTask.inProgress:
        return 'badge badge-primary';
      case StatusTask.done:
        return 'badge badge-success';
      case StatusTask.incomplete:
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
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

  onNewTask() {
    this.route.navigateByUrl('/formTask').then();
  }
}
