/**
 * @author: Ariel Hechavarria Jardines(leiraStudio@gmail.com)
 * @summary: Servicio para gestionar las tareas asociadas a un Usuario
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StatusTask, Task } from '@app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  constructor() {
    this.loadTasksFromLocalStorage();
  }

  /**
   * Obtener las tareas
   */
  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  /**
   * Crear una Tarea
   * @param task
   */
  createTask(task: Task): void {
    this.tasks.push(task);
    this.saveTasksToLocalStorage();
    this.tasksSubject.next(this.tasks);
  }

  /**
   * Actualizar una tarea
   * @param task
   */
  updateTask(task: Task): void {
    const existingTaskIndex = this.tasks.findIndex((t) => t.id === task.id);
    if (existingTaskIndex !== -1) {
      this.tasks[existingTaskIndex] = task;
      this.saveTasksToLocalStorage();
      this.tasksSubject.next(this.tasks);
    }
  }

  /**
   * Eliminar Tarea
   * @param id
   */

  deleteTask(id: string): void {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      this.saveTasksToLocalStorage();
      this.tasksSubject.next(this.tasks);
    }
  }

  /**
   * Filtrar Tarea por estado
   * @param state
   */

  filterTasksByState(state: StatusTask): Task[] {
    return this.tasks.filter((task) => task.status === state);
  }

  /**
   * Filtrar tarea por nombre
   * @param name
   */

  filterTasksByName(name: string): Task[] {
    return this.tasks.filter((task) =>
      task.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  /**
   * Obtener la tarea mas vieja en progreso
   */

  getOldestInProgressTask(): Task | null {
    const inProgressTasks = this.filterTasksByState(StatusTask.inProgress);
    if (inProgressTasks.length === 0) {
      return null;
    }
    // @ts-ignore
    return inProgressTasks.reduce((oldestTask: any, task) => {
      if (!oldestTask) {
        return task;
      }
      const oldestDate = new Date(oldestTask.created_date).getTime();
      const currentDate = new Date(task.created_date).getTime();
      return currentDate < oldestDate ? task : oldestTask;
    }, null);
  }

  /**
   * Obtener la tarea mas atrasada
   */
  getOverdueTasks(): Task[] {
    const currentDate = new Date().getTime();
    return this.tasks.filter(
      (task) =>
        task.status !== StatusTask.done &&
        new Date(task.expire_date).getTime() < currentDate,
    );
  }

  /**
   *   Cargar las tareas desde el localStorage.
   *   @private
   */

  private loadTasksFromLocalStorage(): void {
    const tasksData = localStorage.getItem('tasks');
    if (tasksData) {
      this.tasks = JSON.parse(tasksData);
      this.tasksSubject.next(this.tasks);
    }
  }

  /**
   *   Guardar las tareas en el localStorage.
   * @private
   */

  private saveTasksToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
