import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import Swal from "sweetalert2";
import {FlexModule} from "@angular/flex-layout";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router )


  public userForm: FormGroup = this.fb.group({
    email:    ['leiraStudio@google.com', [ Validators.required, Validators.email ]],
    password: ['123456', [ Validators.required, Validators.minLength(6) ]],
  });
  showPassword=false;


  login() {
    const { email, password } = this.userForm.value;

    this.authService.login(email, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/task'),
        error: (message) => {
          Swal.fire('Error', message, 'error' )
        }
      })

  }


}
