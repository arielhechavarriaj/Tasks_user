import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FlexModule } from '@angular/flex-layout';
import { AuthService } from '@services/auth.service';
import { StatusRegister } from '@app/interfaces';
import Swal from 'sweetalert2';
import { EmailValidator } from '@app/helpers/email.validators';

const passwordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) {
    return null;
  }
  return password.value === confirmPassword.value
    ? null
    : { passwordsNotMatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    RouterLink,
  ],
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  errorMessage = '';
  showPassword: any;
  formOptions: AbstractControlOptions = { validators: passwordValidator };

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public registerForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.minLength(3), Validators.required],
        [EmailValidator.createValidator(this.authService)],
      ],

      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },

    this.formOptions,
  );
  private router = inject(Router);

  ngOnInit() {}

  onSubmit(): void {
    const { name, email, password } = this.registerForm.value;
    this.authService.register(email, password, name).subscribe({
      next: (data) => {
        if (data.message === StatusRegister.created) {
          Swal.fire('Éxito', 'Usuario creado con éxito', 'success').then();
          this.router.navigateByUrl('/auth').then();
        } else if (data.message === StatusRegister.notcreated) {
          Swal.fire(
            'Error',
            'El usuario ya existe en el sistema',
            'error',
          ).then(() => this.registerForm.reset());
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        Swal.fire('Error', this.errorMessage, 'error').then();
      },
    });
  }
}
