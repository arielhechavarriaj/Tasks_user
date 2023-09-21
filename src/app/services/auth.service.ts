/**
 * @author: Ariel Hechavarria Jardines(leiraStudio@gmail.com)
 * @summary: Servicio para gestionar las tareas asociadas a la autorizacion y registro en el sistema
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStatus, StatusRegister, User } from '../interfaces';
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

  /**
   * Registrar un nuevo usuario usando localStorage para persistir la informacion
   * @param email
   * @param password
   * @param name
   */
  register(email: string, password: string, name: string): Observable<any> {
    const usersString = localStorage.getItem('users');
    const users: User[] = usersString ? JSON.parse(usersString) : [];

    const oldUser = users.find((user) => user.email === email);

    if (oldUser) {
      return of({ message: StatusRegister.notCreated });
    }

    const newUser = { email, password, name };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return of({ message: StatusRegister.created });
  }

  /**
   * Verificar si existe el usuario mediante el email.
   * @param email
   */
  isEmailTaken(email: string): Observable<any> {
    const _users = localStorage.getItem('users');
    const users: User[] = _users ? JSON.parse(_users) : [];
    return of(users.find((user) => user.email === email));
  }

  /**
   * Validar las credenciales para autorizar a un usuario
   * @param email
   * @param password
   */
  login(email: string, password: string): Observable<boolean> {
    const usersString = localStorage.getItem('users');
    const users: User[] = usersString ? JSON.parse(usersString) : [];

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

  /**
   * Verificar si el cliente tiene los permisos correctos para estar en el sistema mediante el token de accesso
   */
  checkAuthStatus() {
    const _currentUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

    if (!token || !_currentUser) {
      this.logout();
    } else {
      const currentUser: User = JSON.parse(_currentUser);
      this._authStatus.set(AuthStatus.authenticated);
      this._currentUser.set(currentUser);
    }
  }

  /**
   * Salir del sistema, eliminado la informacion de acceso
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this.router.navigateByUrl('/auth').then();
  }

  /**
   * Funcion auxiliar para generar un token, esto es solo para cumplir con los objetivos de la prueba una aplicacion real ,
   * maneja esto de muchas otras maneras
   * @param payload
   * @param secretKey
   */
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

  /**
   * Guardar la informacion del login exitoso
   * @param user
   * @param token
   * @private
   */
  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);

    console.log(user, 'USER');

    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    return true;
  }
}
