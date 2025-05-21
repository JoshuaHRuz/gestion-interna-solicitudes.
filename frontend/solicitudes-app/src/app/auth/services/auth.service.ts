// src/app/auth/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, timer } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { UserCredentials, RegistrationData, AuthResponse } from '../models/auth.models';

const FAKE_TOKEN = 'fake-jwt-token-for-frontend-dev';
const USER_DATA_KEY = 'currentUserData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos signal para el estado reactivo del usuario actual
  currentUser = signal<AuthResponse | null>(this.loadUserFromStorage());

  constructor(private router: Router) {}

  private loadUserFromStorage(): AuthResponse | null {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  private saveUserToStorage(userData: AuthResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      localStorage.setItem('authToken', userData.token); // Guardar token por separado si se prefiere
    }
    this.currentUser.set(userData);
  }

  private removeUserFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem('authToken');
    }
    this.currentUser.set(null);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // O basado en this.currentUser() !== null
  }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    console.log('AuthService: Intentando login con', credentials);
    // --- SIMULACIÓN DE LLAMADA HTTP ---
    return timer(1000).pipe( // Simula delay de red
      switchMap(() => {
        if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
          const mockResponse: AuthResponse = {
            token: FAKE_TOKEN,
            userId: '1',
            username: 'TestUser',
            email: credentials.email,
            roles: ['ROLE_EMPLEADO']
          };
          this.saveUserToStorage(mockResponse);
          console.log('AuthService: Login exitoso simulado', mockResponse);
          return of(mockResponse);
        } else {
          console.error('AuthService: Credenciales inválidas simuladas');
          return throwError(() => new Error('Credenciales inválidas (simulado)'));
        }
      })
    );
    // --- FIN SIMULACIÓN ---

    // --- CUANDO TENGA BACKEND (ejemplo): ---
    // return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
    //   tap(response => {
    //     this.saveUserToStorage(response);
    //     console.log('AuthService: Login exitoso desde backend', response);
    //   })
    // );
  }

  register(data: RegistrationData): Observable<any> { // 'any' podría ser un MessageResponse
    console.log('AuthService: Intentando registrar', data);
    // --- SIMULACIÓN DE LLAMADA HTTP ---
    return timer(1000).pipe(
      switchMap(() => {
        if (data.email === 'exists@example.com') {
          console.error('AuthService: Email ya existe (simulado)');
          return throwError(() => new Error('Este correo electrónico ya está registrado (simulado).'));
        }
        // Simula un registro exitoso
        const mockMessage = { message: 'Usuario registrado exitosamente (simulado)!' };
        console.log('AuthService: Registro exitoso simulado');
        return of(mockMessage);
      })
    );
    // --- FIN SIMULACIÓN ---

    // --- CUANDO TENGA BACKEND (ejemplo): ---
    // return this.http.post('/api/auth/register', data);
  }

  logout(): void {
    console.log('AuthService: Cerrando sesión');
    this.removeUserFromStorage();
    this.router.navigate(['/login']);
  }

  // Helper para obtener el rol (ejemplo)
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user ? user.roles.includes(role) : false;
  }
}