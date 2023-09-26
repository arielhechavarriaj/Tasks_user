import { computed, Injectable, signal } from '@angular/core';
import { Task } from '@app/interfaces';

export interface TaskModal {
  stateModal: StateModal;
  expiredTasks: Task[];
}

export enum StateModal {
  open = 'open',
  close = 'close',
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _display = signal<TaskModal>({
    expiredTasks: [],
    stateModal: StateModal.close,
  });
  public display = computed(this._display);

  open(expiredTasks: Task[]) {
    this._display.set({
      expiredTasks,
      stateModal: StateModal.open,
    });
  }

  close() {
    this._display.set({ expiredTasks: [], stateModal: StateModal.close });
  }
}
