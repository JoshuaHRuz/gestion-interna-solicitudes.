
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../../auth/services/auth.service'; // Importo AuthService y UserRole

  export const roleGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[]; // Obtengo los roles requeridos de la data de la ruta

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const currentUser = authService.getCurrentUser();
    if (currentUser && requiredRoles.includes(currentUser.role)) {
      return true; // Usuario autenticado y con el rol necesario
    } else {
      // Si no tiene el rol, puedo redirigir a una página de "Acceso Denegado"
      // o al dashboard por defecto
      router.navigate(['/dashboard']); // O '/acceso-denegado'
      alert('No tienes permisos para acceder a esta sección.');
      return false;
    }
  }

  return true; // Si no se especifican roles, solo se requiere autenticación
};