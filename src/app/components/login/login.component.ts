import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FlexModule } from '@angular/flex-layout';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showPassword = false;
  private fb = inject(FormBuilder);
  public userForm: FormGroup = this.fb.group({
    email: ['leiraStudio@google.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });
  private authService = inject(AuthService);
  private router = inject(Router);

  login() {
    const { email, password } = this.userForm.value;

    this.authService.login(email, password).subscribe({
      next: (data) => {
        if (data) this.router.navigateByUrl('/task').then();
        else {
          Swal.fire('Info', 'El usuario no existe', 'info').then();
        }
      },
      error: (message) => {
        Swal.fire('Error', message, 'error').then();
      },
    });
  }
}
