// src/app/app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para ngIf
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { AuthService, AuthUser, UserRole } from './auth/services/auth.service'; // Importa AuthUser y UserRole
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'; // Para el menú desplegable

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule // Añadir MatMenuModule
  ], 
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'solicitudes-app';
  currentYear: number = new Date().getFullYear();
  public authService = inject(AuthService);
  currentUser: AuthUser | null = null;

  constructor() { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get isEmpleado(): boolean {
    return this.currentUser?.role === 'EMPLEADO';
  }

  get isSupervisor(): boolean {
    return this.currentUser?.role === 'SUPERVISOR';
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMINISTRADOR';
  }

  get userName(): string {
    if (this.currentUser?.email) {
      return this.currentUser.email.split('@')[0]; // Devuelve la parte antes del @
    }
    return 'Invitado';
  }

  // Este método ya lo tenías, lo conservamos por si lo usas en otro lado,
  // pero para el template principal de app.component usaremos los getters de rol.
  isSupervisorOrAdminWithDepartment(): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && (user.role === 'SUPERVISOR' || user.role === 'ADMINISTRADOR') && user.department);
  }
  
  logout(): void {
    this.authService.logout();
  }
}