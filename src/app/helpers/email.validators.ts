import {AbstractControl, AsyncValidatorFn, ValidationErrors,} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from "../services/auth.service";


export class EmailValidator {
  static createValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      // @ts-ignore
      return authService
        .isEmailTaken(control.value)
        .pipe(
          map((result: boolean) =>
            result ? {emailTaken: true} : null
          )
        );
    };
  }
}
