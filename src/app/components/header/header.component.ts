import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FlexModule, RouterLink],
  template: ` <div class="container-fluid  ">
    <nav class="navbar shadow-sm ">
      <button
        class="btn btn-outline-success bi bi-house mx-1"
        routerLink=""
        type="button"
      ></button>
      <strong class="navbar-brand text-success ">Gestionar Tareas</strong>
      <form class="d-flex" role="search">
        <button
          class="btn btn-outline-success bi bi-person-circle mx-1"
          routerLink="author"
          type="button"
        ></button>
        <button
          (click)="onLogout()"
          class="btn btn-outline-success bi bi-box-arrow-right"
          type="button"
        ></button>
      </form>
    </nav>
  </div>`,
  styles: [``],
})
export class HeaderComponent {
  authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }
}
