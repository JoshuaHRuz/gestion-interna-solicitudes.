// src/app/services/auth.service.ts (o la ruta donde tengas tu AuthService)

import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export type UserRole = 'EMPLEADO' | 'SUPERVISOR' | 'ADMINISTRADOR';

export interface AuthUser {
  email: string;
  role: UserRole;
  area?: string;
  // Otros datos del usuario si son necesarios
}

// Nueva interfaz para las credenciales de login (si no la tienes ya)
export interface LoginCredentials {
  email: string;
  password?: string; // Hago password opcional si no lo voy a usar en la simulación
}

// Nueva interfaz para datos de registro (si no la tienes ya)
export interface RegistrationData extends LoginCredentials {
  email: string;
  // Otros campos de registro como area, nombre, etc.
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this._currentUserSubject.asObservable(); // Observable para suscribirse en componentes
  private router = inject(Router);

  constructor() {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      this._currentUserSubject = JSON.parse(storedUser);
    }
  }

  // MODIFICACIÓN 1: El método login ahora acepta un objeto LoginCredentials
  login(credentials: LoginCredentials): Observable<any> {
    const { email, password } = credentials; // Desestructuro para usar username y password

    // Simulación de login con roles
    return of({
      token: 'fake-jwt-token-123',
      user: this.getSimulatedUserByUsername(email)
    }).pipe(
      delay(1000),
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this._currentUserSubject.next(response.user); // Emitir el nuevo usuario a los suscriptores
        localStorage.setItem('current_user', JSON.stringify(response.user));
      })
    );
  }

  // MODIFICACIÓN 2: Añado el método register
  register(registrationData: RegistrationData): Observable<any> {
      console.log('Simulando registro de usuario:', registrationData);
      // Aquí en un proyecto real harías una petición HTTP a tu backend
      // return this.http.post<any>(`${this.apiUrl}/register`, registrationData);

      // Simulación de registro exitoso
      return of({ message: 'Registro exitoso!', user: { username: registrationData.email, role: 'EMPLEADO' } }).pipe(
          delay(1500), // Simulo un pequeño retraso
          tap(res => console.log('Registro simulado completo', res))
      );
  }

  private getSimulatedUserByUsername(username: string): AuthUser {
    switch (username.toLowerCase()) {
      case 'empleado':
        return { email: 'Empleado', role: 'EMPLEADO' };
      case 'supervisor':
        return { email: 'Supervisor', role: 'SUPERVISOR', area: 'IT' }; // Supervisor de IT
      case 'admin':
        return { email: 'Admin', role: 'ADMINISTRADOR' };
      default:
        return { email: username, role: 'EMPLEADO' }; // Por defecto, si no coincide
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this._currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    // Puedes basarte en el token o en el valor actual del BehaviorSubject
    return !!localStorage.getItem('auth_token') && !!this._currentUserSubject.getValue();
  }

  // MODIFICACIÓN 2: Un método getter para obtener el valor actual del usuario si es necesario síncronamente
  // Aunque para templates es mejor usar el observable con el pipe async
  getCurrentUser(): AuthUser | null {
    return this._currentUserSubject.getValue();
  }

  hasRole(role: UserRole): boolean {
    return this._currentUserSubject.getValue()?.role === role;
  }
}