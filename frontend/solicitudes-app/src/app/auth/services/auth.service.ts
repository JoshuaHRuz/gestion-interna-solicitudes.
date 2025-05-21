import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export type UserRole = 'EMPLEADO' | 'SUPERVISOR' | 'ADMINISTRADOR';
export type Department = 'IT' | 'RRHH' | 'FINANZAS' | 'VENTAS' | 'ADMINISTRACION' | 'OPERACIONES'; // Añadí OPERACIONES por si acaso

export interface AuthUser {
  email: string; // Asumiendo que el login ahora es por email
  role: UserRole;
  department?: Department;
  // Otros datos del usuario si son necesarios
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegistrationData extends LoginCredentials {
  // email ya está en LoginCredentials
  username?: string; // Opcional, si quieres tenerlo para el display pero el login es por email
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Declaración e inicialización CORRECTA del BehaviorSubject
  private _currentUserSubject: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this._currentUserSubject.asObservable();
  private router = inject(Router);

  constructor() {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try {
        // CORRECCIÓN CLAVE AQUÍ: Usar .next() para emitir el valor
        this._currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user from localStorage:", e);
        localStorage.removeItem('current_user'); // Limpiar si los datos están corruptos
      }
    }
  }

  // El método login ahora acepta un objeto LoginCredentials
  login(credentials: LoginCredentials): Observable<any> {
    const { email, password } = credentials;
    const simulatedIdentifier = credentials.email; // Usamos el email como identificador para la simulación

    // Simulación de login con roles
    return of({
      token: 'fake-jwt-token-123',
      user: this.getSimulatedUserByIdentifier(simulatedIdentifier) // Usar el nuevo nombre de función
    }).pipe(
      delay(1000),
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this._currentUserSubject.next(response.user); // Emitir el nuevo usuario a los suscriptores
        localStorage.setItem('current_user', JSON.stringify(response.user));
      })
    );
  }

  register(registrationData: RegistrationData): Observable<any> {
      console.log('Simulando registro de usuario:', registrationData);
      // Simulación de registro exitoso
      return of({ message: 'Registro exitoso!', user: { email: registrationData.email, role: 'EMPLEADO' } }).pipe( // Usar email para el usuario simulado
          delay(1500),
          tap(res => console.log('Registro simulado completo', res))
      );
  }

  // Renombrado para ser más genérico, ya que ahora usamos email
  private getSimulatedUserByIdentifier(identifier: string): AuthUser {
        const idPart = identifier.split('@')[0].toLowerCase(); // <--- Extrae la parte antes del '@'

    switch (idPart) { // <--- Compara con la parte extraída
      case 'empleado':
        return { email: 'empleado@emqu.com', role: 'EMPLEADO' };
      case 'supervisor':
        return { email: 'supervisor@emqu.com', role: 'SUPERVISOR', department: 'IT' };
      case 'supervisor2':
        return { email: 'supervisor2@emqu.com', role: 'SUPERVISOR', department: 'RRHH' };
      case 'supervisorventas': // Asegúrate de que el nombre de case coincida con la parte del email
        return { email: 'supervisorventas@emqu.com', role: 'SUPERVISOR', department: 'VENTAS' };
      case 'supervisorfi': // Asegúrate de que el nombre de case coincida con la parte del email
        return { email: 'supervisorfi@emqu.com', role: 'SUPERVISOR', department: 'FINANZAS' };
      case 'admin':
        return { email: 'admin@emqu.com', role: 'ADMINISTRADOR', department: 'ADMINISTRACION' };
      default:
        // Si el email no coincide con ningún caso específico, lo tratamos como un empleado.
        // Asegúrate de que el email aquí sea el 'identifier' completo
        return { email: identifier, role: 'EMPLEADO' };
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this._currentUserSubject.next(null); // Emitir null al cerrar sesión
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token') && !!this._currentUserSubject.getValue();
  }

  getCurrentUser(): AuthUser | null {
    return this._currentUserSubject.getValue();
  }

  hasRole(role: UserRole): boolean {
    return this._currentUserSubject.getValue()?.role === role;
  }

  hasDepartment(): boolean {
    return !!this._currentUserSubject.getValue()?.department;
  }
}