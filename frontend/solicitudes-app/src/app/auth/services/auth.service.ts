import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export type UserRole = 'EMPLEADO' | 'SUPERVISOR' | 'ADMINISTRADOR';
export type Department = 'IT' | 'RRHH' | 'FINANZAS' | 'VENTAS' | 'ADMINISTRACION' | 'OPERACIONES'; // Añadí OPERACIONES por si acaso

export interface AuthUser {
  id?: number; // El backend devuelve un ID
  email: string;
  role: UserRole;
  department?: Department;
  username?: string; // El backend puede devolver username
  // Otros datos del usuario si son necesarios
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegistrationData extends LoginCredentials {
  username?: string;
}

// DTO para la respuesta del login desde el backend
export interface JwtResponseDTO {
  token: string;
  type: string;
  id: number;
  email: string;
  username?: string;
  roles: string[]; // Spring Security usualmente devuelve roles como "ROLE_ADMINISTRADOR"
  department?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gestion-interna-solicitudes-production.up.railway.app/api'; // URL base de tu API en Railway

  private _currentUserSubject: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this._currentUserSubject.asObservable();
  private router = inject(Router);
  private http = inject(HttpClient); // Inyectar HttpClient

  constructor() {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try {
        this._currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user from localStorage:", e);
        localStorage.removeItem('current_user');
      }
    }
  }

  // El método login ahora acepta un objeto LoginCredentials
  login(credentials: LoginCredentials): Observable<JwtResponseDTO> { // Cambiar el tipo de retorno a JwtResponseDTO
    return this.http.post<JwtResponseDTO>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        
        // Mapear la respuesta del backend al formato AuthUser
        const user: AuthUser = {
          id: response.id,
          email: response.email,
          // El backend devuelve roles como ["ROLE_ADMINISTRADOR"], necesitamos extraer el nombre del rol.
          // Asumimos que solo hay un rol principal por ahora.
          role: response.roles[0].replace('ROLE_', '') as UserRole, 
          department: response.department as Department,
          username: response.username
        };
        this._currentUserSubject.next(user);
        localStorage.setItem('current_user', JSON.stringify(user));
      }),
      catchError(this.handleError) // Añadir manejo de errores
    );
  }

  register(registrationData: RegistrationData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, registrationData).pipe(
      tap(response => {
        // El backend de registro actual devuelve un mensaje de éxito.
        // Podríamos querer que devuelva el usuario o incluso un token para auto-login.
        // Por ahora, solo logueamos la respuesta.
        console.log('Registro exitoso desde el backend:', response);
      }),
      catchError(this.handleError) // Añadir manejo de errores
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this._currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token') && !!this._currentUserSubject.getValue();
  }

  getCurrentUser(): AuthUser | null {
    return this._currentUserSubject.getValue();
  }

  hasRole(role: UserRole): boolean {
    const currentUser = this._currentUserSubject.getValue();
    // Ajustar la comparación si el backend devuelve roles con prefijo "ROLE_"
    return currentUser?.role === role;
  }

  hasDepartment(): boolean {
    return !!this._currentUserSubject.getValue()?.department;
  }

  // Método simple para manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error
      // El cuerpo del error puede contener pistas, o podríamos tener mensajes de error estandarizados.
      errorMessage = `Error Código: ${error.status}\\nMensaje: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage += `\\nBackend: ${error.error}`;
      } else if (error.error && error.error.message) {
        errorMessage += `\\nBackend: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}