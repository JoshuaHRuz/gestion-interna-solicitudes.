// src/app/auth/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // El usuario está autenticado, permite el acceso
  } else {
    // El usuario no está autenticado, redirige a la página de login
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Opcional: guardar la URL a la que intentaba acceder
    return false;
  }
};