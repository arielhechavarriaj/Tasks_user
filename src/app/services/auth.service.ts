import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AuthStatus,
  RegisterResponse,
  StatusRegister,
  User,
} from '../interfaces';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private secretKey = '%ariel.$task.$app.#';

  private _currentUser = signal<User | null>(null);
  public currentUser = computed(() => this._currentUser());

  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  public authStatus = computed(() => this._authStatus());
  router = inject(Router);

  constructor() {
    this.checkAuthStatus();
  }

  register(
    email: string,
    password: string,
    name: string,
  ): Observable<RegisterResponse> {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '') || [];
    const oldUser = users.find((user) => user.email === email);

    if (oldUser) {
      return of({ message: StatusRegister.notcreated });
    }

    const newUser = { email, password, name };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return of({ message: StatusRegister.created });
  }

  isEmailTaken(email: string): Observable<any> {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '') || [];
    return of(users.find((user) => user.email === email));
  }

  login(email: string, password: string): Observable<boolean> {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '') || [];
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      const payload = { sub: email };
      const token = this.generateToken(payload, this.secretKey);
      return of(this.setAuthentication(user, token));
    }

    return of(false);
  }

  checkAuthStatus() {
    const currentUser: User =
      JSON.parse(localStorage.getItem('currentUser') || '') || null;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
    } else {
      this._authStatus.set(AuthStatus.authenticated);
      this._currentUser.set(currentUser);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this.router.navigateByUrl('/auth').then();
  }

  generateToken(payload: any, secretKey: string): string {
    const encodedPayload = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(JSON.stringify(payload)),
    );
    const encodedHeader = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse('{"alg":"HS256","typ":"JWT"}'),
    );
    const signature = CryptoJS.HmacSHA256(
      encodedHeader + '.' + encodedPayload,
      secretKey,
    );

    return `${encodedHeader}.${encodedPayload}.${CryptoJS.enc.Base64.stringify(
      signature,
    )}`;
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);

    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    return true;
  }
}
