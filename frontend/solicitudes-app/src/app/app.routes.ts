// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../app/auth/guards/auth.guard'; // Para rutas básicas de autenticación
import { roleGuard } from '../app/core/guards/role.guard'; // Mi nuevo guard de roles
import { UserRole } from '../app/auth/services/auth.service'; // Mis roles

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../app/auth/pages/login/login.component').then(c => c.LoginComponent)
  },
    {
    path: 'register',
    loadComponent: () => import('../app/auth/pages/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard] // Todos los usuarios autenticados pueden ver el dashboard genérico
  },
  {
    path: 'solicitudes', // Rutas de empleado (Mis Solicitudes, Crear, Detalle)
    loadChildren: () => import('./solicitudes/solicitudes.routes').then(r => r.SOLICITUDES_ROUTES),
    canActivate: [roleGuard], // <-- Uso roleGuard
    data: { roles: ['EMPLEADO', 'SUPERVISOR', 'ADMINISTRADOR'] as UserRole[] } // Todos pueden acceder a SUS solicitudes
  },
/*   {
    path: 'supervisor', // <-- NUEVA RUTA PARA SUPERVISORES
    //loadChildren: () => import('./supervisor/supervisor.routes').then(r => r.SUPERVISOR_ROUTES),
    canActivate: [roleGuard], // Protejo con el guard de roles
    data: { roles: ['SUPERVISOR', 'ADMINISTRADOR'] as UserRole[] } // Solo supervisores y admins
  }, */
  // {
  //   path: 'admin', // <-- FUTURA RUTA PARA ADMINISTRADORES
  //   loadChildren: () => import('./admin/admin.routes').then(r => r.ADMIN_ROUTES),
  //   canActivate: [roleGuard],
  //   data: { roles: ['ADMINISTRADOR'] as UserRole[] }
  // },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];