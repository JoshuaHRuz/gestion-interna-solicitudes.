// src/app/app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para ngIf
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { AuthService, AuthUser } from './auth/services/auth.service'; // Importa AuthUser

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], // Asegúrate de incluir RouterLinkActive
  templateUrl: './app.component.html', // Este es el archivo que editaremos
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'solicitudes-app';
  currentYear: number = new Date().getFullYear();
  public authService = inject(AuthService); // Inyectar AuthService públicamente

  // PROPIEDAD ADICIONAL PARA EL TEMPLATE
  // Usaremos esta para almacenar el usuario actual y evitar llamar a un método en el template.
  currentUser: AuthUser | null = null;

  constructor() { }

  ngOnInit(): void {
    // Suscribirse al observable del usuario actual para mantener 'currentUser' actualizado
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Método para manejar el logout (ya lo tenías en tu AuthService)
  logout(): void { // Renombro a logout para que coincida con tu HTML
    this.authService.logout();
  }
}