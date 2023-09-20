import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FlexModule],
  template: ` <div
    class="text-success"
    fxLayout="row"
    fxLayoutAlign="center center"
  >
    leiraStudio | 2023
  </div>`,
  styles: [
    `
      :host {
        padding: 15px;
      }
    `,
  ],
})
export class FooterComponent {}
