import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AuthStatus, StatusRegister } from '../interfaces';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should register a new user', () => {
    const email = 'test@example.com';
    const password = 'password';
    const name = 'Test User';

    const response: any = authService.register(email, password, name);

    expect(response.message).toBe(StatusRegister.created);
  });

  it('should check if an email is taken', () => {
    const email = 'test@example.com';

    authService.register(email, 'password', 'Test User');

    authService.isEmailTaken(email).subscribe((result) => {
      expect(result).toBeTruthy(); // Email should be taken
    });
  });

  it('should login with valid credentials', () => {
    const email = 'test@example.com';
    const password = 'password';
    authService.register(email, password, 'Test User');

    authService.login(email, password).subscribe((result) => {
      expect(result).toBeTruthy(); // Login should succeed
    });
  });

  it('should not login with invalid credentials', () => {
    const email = 'test@example.com';
    const password = 'password';
    authService.register(email, password, 'Test User');

    authService.login(email, 'wrongpassword').subscribe((result) => {
      expect(result).toBeFalsy(); // Login should fail
    });
  });

  it('should logout', () => {
    authService.logout();

    expect(authService.authStatus()).toBe(AuthStatus.notAuthenticated);
  });

  // Add more test cases as needed for your specific service methods.
});
