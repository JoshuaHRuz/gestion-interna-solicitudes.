// src/app/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators'; // <--- Importa map y take

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, // <--- Añade ActivatedRouteSnapshot
  state: RouterStateSnapshot      // <--- Añade RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el observable currentUser$ para reaccionar a los cambios de estado del usuario
  return authService.currentUser$.pipe(
    take(1), // Tomamos solo el primer valor emitido y luego completamos
    map(user => {
      // 1. Verificar autenticación: ¿Hay un usuario logueado?
      if (!user) {
        console.warn('AuthGuard: No hay usuario logueado. Redirigiendo a /login.');
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // 2. Verificar autorización por rol: ¿La ruta requiere roles específicos?
      // La propiedad 'roles' se define en la configuración de la ruta (ej. data: { roles: ['SUPERVISOR'] })
      const requiredRoles = route.data['roles'] as string[];

      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = user.role.toUpperCase(); // Obtiene el rol del usuario logueado y lo convierte a mayúsculas
        const hasRequiredRole = requiredRoles.some(role => role.toUpperCase() === userRole); // Compara con los roles requeridos

        if (!hasRequiredRole) {
          console.warn(`AuthGuard: Acceso denegado. Rol de usuario "${user.role}" no autorizado para esta ruta. Roles requeridos: ${requiredRoles.join(', ')}.`);
          // Redirige al dashboard o a una página de "acceso denegado"
          router.navigate(['/dashboard']); // Redirigir al dashboard por defecto
          return false;
        }
      }

      // 3. Si llega hasta aquí, el usuario está autenticado y tiene los roles necesarios (o no se requieren roles)
      console.log(`AuthGuard: Acceso permitido para el usuario "${user.email}" con rol "${user.role}".`);
      return true;
    })
  );
};