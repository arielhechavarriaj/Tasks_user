/**
 * @author: Ariel Hechavarria Jardines(leiraStudio@gmail.com)
 * @summary: Servicio para gestionar las tareas asociadas a un Usuario
 */
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '@app/interfaces';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  router = inject(Router);
  private _tasks = signal<Task[]>([]);
  public tasks = computed(() => this._tasks());

  constructor() {
    this.loadTasksFromLocalStorage();
  }

  /**
   * Obtener las tareas
   */

  getTasks(
    page = '1',
    start = '0',
    limit = '10',
    filterStatus = '',
    filterName = '',
  ): Observable<Task[]> {
    let filteredTasks: Task[] = this.tasks();

    if (filterStatus) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filterStatus,
      );
    }

    if (filterName) {
      filteredTasks = filteredTasks.filter((task) =>
        task.name.includes(filterName),
      );
    }
    const startIndex = parseInt(start, 10);
    const endIndex = startIndex + parseInt(limit, 10);
    filteredTasks = filteredTasks.slice(startIndex, endIndex);

    return new Observable<Task[]>((observer) => {
      // Simulanddo un llamada a la api
      setTimeout(() => {
        observer.next(filteredTasks);
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Obtener las tareas
   */
  getTaskbyId(id: string): Observable<Task> {
    const _tasks = localStorage.getItem('tasks');
    const collectionTaks: Task[] = _tasks ? JSON.parse(_tasks) : [];
    return of(collectionTaks.filter((t) => t.id == id)[0]);
  }

  /**
   * Crear una Tarea
   * @param newTask
   */
  createTask(newTask: Task): void {
    const _tasks = localStorage.getItem('tasks');
    const collectionTaks: Task[] = _tasks ? JSON.parse(_tasks) : [];
    collectionTaks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(collectionTaks));

    this.router.navigateByUrl('/task').then();
    Swal.fire('Éxito', 'La tarea se ha creado con éxito', 'success').then();
  }

  /**
   * Verificar si existe una tarea mediante el nombre.
   * @param name
   */
  isNameTaken(name: string): Observable<any> {
    const _tasks = localStorage.getItem('tasks');
    const tasks: Task[] = _tasks ? JSON.parse(_tasks) : [];
    return of(tasks.find((t) => t.name === name));
  }

  /**
   * Actualizar una tarea
   * @param task
   */
  updateTask(task: any): void {
    console.log(task, 'updating.....');
    const existingTaskIndex = this.tasks().findIndex((t) => t.id === task.id);
    if (existingTaskIndex !== -1) {
      this.tasks()[existingTaskIndex] = task;
      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
      this.router.navigateByUrl('/task').then();
      Swal.fire(
        'Éxito',
        'La tarea se ha actualizado con éxito',
        'success',
      ).then();
    }
  }

  /**
   * Eliminar Tarea
   * @param id
   */

  deleteTask(id: string): Observable<any> {
    const taskIndex = this.tasks().findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      this.tasks().splice(taskIndex, 1);
      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
      Swal.fire(
        'Éxito',
        'La tarea se ha eliminado con éxito',
        'success',
      ).then();
      return of(true);
    }
    return of(false);
  }
  //
  // /**
  //  * Filtrar Tarea por estado
  //  * @param state
  //  */
  //
  // filterTasksByState(state: StatusTask): Task[] {
  //   return this.tasks.filter((task) => task.status === state);
  // }
  //
  // /**
  //  * Filtrar tarea por nombre
  //  * @param name
  //  */
  //
  // filterTasksByName(name: string): Task[] {
  //   return this.tasks.filter((task) =>
  //     task.name.toLowerCase().includes(name.toLowerCase()),
  //   );
  // }
  //
  // /**
  //  * Obtener la tarea mas vieja en progreso
  //  */
  //
  // getOldestInProgressTask(): Task | null {
  //   const inProgressTasks = this.filterTasksByState(StatusTask.inProgress);
  //   if (inProgressTasks.length === 0) {
  //     return null;
  //   }
  //   // @ts-ignore
  //   return inProgressTasks.reduce((oldestTask: any, task) => {
  //     if (!oldestTask) {
  //       return task;
  //     }
  //     const oldestDate = new Date(oldestTask.created_date).getTime();
  //     const currentDate = new Date(task.created_date).getTime();
  //     return currentDate < oldestDate ? task : oldestTask;
  //   }, null);
  // }
  //
  // /**
  //  * Obtener la tarea mas atrasada
  //  */
  // getOverdueTasks(): Task[] {
  //   const currentDate = new Date().getTime();
  //   return this.tasks.filter(
  //     (task) =>
  //       task.status !== StatusTask.done &&
  //       new Date(task.expire_date).getTime() < currentDate,
  //   );
  // }

  /**
   *   Cargar las tareas desde el localStorage.
   *   @private
   */

  private loadTasksFromLocalStorage(): void {
    const tasksData = localStorage.getItem('tasks');
    if (tasksData !== 'undefined') {
      // @ts-ignore
      const data = JSON.parse(tasksData);
      this._tasks.set(data);
    }
  }
}
