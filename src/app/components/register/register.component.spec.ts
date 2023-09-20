import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '@services/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['register']);
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register a new user', () => {
    authService.register.and.returnValue(
      new BehaviorSubject<any>({ message: 'created' }),
    );
    const navigateByUrlSpy = spyOn(
      component['router'],
      'navigateByUrl',
    ).and.returnValue(Promise.resolve(true));

    component.registerForm.setValue({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      confirmPassword: 'password',
    });

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(
      'johndoe@example.com',
      'password',
      'John Doe',
    );

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/auth');
    // You can add more expectations here based on your component's behavior.
  });

  it('should handle user already exists', () => {
    authService.register.and.returnValue(
      new BehaviorSubject<any>({ message: 'notcreated' }),
    );
    // @ts-ignore

    const resetSpy = spyOn(component.registerForm, 'reset');

    component.registerForm.setValue({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      confirmPassword: 'password',
    });

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(
      'johndoe@example.com',
      'password',
      'John Doe',
    );

    expect(resetSpy).toHaveBeenCalled();
    // You can add more expectations here based on your component's behavior.
  });
});
