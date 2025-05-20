// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth/services/auth.service'; // Importar AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'solicitudes-app';
  currentYear: number;
  authService = inject(AuthService); // Inyectar AuthService

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  logout(): void {
    this.authService.logout();
  }
}