import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, StateModal } from '@services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  modalService = inject(ModalService);
  protected readonly StateModal = StateModal;

  close() {
    this.modalService.close();
  }
}
