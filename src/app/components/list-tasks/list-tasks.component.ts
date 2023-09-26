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
import { FlexModule } from '@angular/flex-layout';
import { ModalService } from '@services/modal.service';
import { ModalComponent } from '@components/modal/modal.component';

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    ModalComponent,
  ],
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
  modalService = inject(ModalService);

  colorStatusMap = new Map();
  taskForm: FormGroup = this.fb.group({
    filterName: [''],
    filterStatus: [''],
    searchServer: [true],
  });

  pageIndex = 0;
  pageSize = 5;
  totalTaskCount = this.taskService.tasks().length;
  filterName = '';
  loading = false;
  notData = false;
  protected readonly StatusTask = StatusTask;

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
        this.pageIndex,
        this.pageSize,
        this.filterStatus,
        this.filterName,
      )
      .subscribe((tasks) => {
        console.log(tasks);
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

    this.modalService.open(expiredTasks);
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

  onRemoveTask(task: Task) {
    Swal.fire({
      title: 'Esta seguro que quiere eliminar esta tarea?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(task.id).subscribe(() => this.loadTaks());
      } else if (result.isDenied) {
        console.log(12);
      }
    });
  }

  /**
   * Calcula el número total de páginas disponibles
   */
  totalPages(): number {
    return Math.ceil(this.totalTaskCount / this.pageSize);
  }

  /**
   * Retorna un array con los números de página para mostrar en la paginación
   */
  pages(): number[] {
    const totalPages = this.totalPages();
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  /**
   * Cambia la página actual y vuelve a cargar las tareas
   * @param page Número de página al que se debe cambiar
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageIndex = page;
      this.loadTaks();
    }
  }
}
