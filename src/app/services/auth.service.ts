import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthStatus, CheckTokenResponse, RegisterResponse, StatusRegister, User} from '../interfaces';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private secretKey = '%ariel.$task.$app.#';

  private readonly baseUrl: string = 'environment.baseUrl';
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  //Para accesso publico
  public currentUser = computed(() => this._currentUser());
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  register(email: string, password: string, name: string): Observable<RegisterResponse> {
    // Comprobar si el usuario ya existe en el localStorage
    // @ts-ignore
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const oldUsers = users.find((user: any) => user.email === email);

    if (oldUsers) {
      // El usuario ya está registrado
      return of({message: StatusRegister.notcreated});
    }

    // Crear un nuevo usuario
    const newUser = {email, password, name};
    users.push(newUser);

    // Guardar la lista actualizada de usuarios en el localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Devolver una respuesta exitosa
    return of({message: StatusRegister.created});
  }

  /**
   * Verificar que el email sea unico
   * @param email
   */
  isEmailTaken(email: string): Observable<any> {
    // @ts-ignore
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return of(users.find((user: any) => user.email === email));
  }

  login(email: string, password: string): Observable<boolean> {

    // @ts-ignore
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const payload = {sub: email};
      const token = this.createJwtToken(payload, this.secretKey);
      return of(this.setAuthentication(user, token));
    }

    return of();
  }

  checkAuthStatus(): Observable<boolean> {

    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);


    return this.http.get<CheckTokenResponse>(url, {headers})
      .pipe(
        map(({user, token}) => this.setAuthentication(user, token)),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );


  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);

  }

  private setAuthentication(user: User, token: string): boolean {

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  /**
   * Estas funciones son simplementes para generar el token, dado el contexto de la prueba es que se usan
   * pero solo en este contexto por temas de seguridad, etc....
   * https://stackoverflow.com/a/69094721
   */
  private createJwtToken(payload: any, secretKey: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = this.base64url(JSON.stringify(header));
    const encodedPayload = this.base64url(JSON.stringify(payload));

    const token = encodedHeader + '.' + encodedPayload;

    const signature = this.base64url(CryptoJS.HmacSHA256(token, secretKey));

    return token + '.' + signature;
  }

  private base64url(source: any): string {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);

    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
  }


}
