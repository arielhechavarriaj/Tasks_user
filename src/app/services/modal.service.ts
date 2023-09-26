import { computed, Injectable, signal } from '@angular/core';

export enum StateModal {
  open = 'open',
  close = 'close',
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _display = signal<StateModal>(StateModal.close);
  public display = computed(this._display);

  open() {
    this._display.set(StateModal.open);
  }

  close() {
    this._display.set(StateModal.close);
  }
}
