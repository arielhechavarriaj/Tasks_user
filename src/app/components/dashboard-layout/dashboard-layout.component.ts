import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FlexModule } from '@angular/flex-layout';
import { FooterComponent, HeaderComponent } from '@app/components';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    FlexModule,
  ],
  template: `
    <app-header fxLayout="column"></app-header>
    <div fxFlex="100" fxLayout="row">
      <div class="content" fxFlex fxLayout="column">
        <router-outlet></router-outlet>
      </div>
    </div>
    <app-footer fxLayout="column"></app-footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 100%;
      }

      .content {
        background: rgba(235, 245, 236, 0.92);
      }
    `,
  ],
})
export class DashboardLayoutComponent {}
