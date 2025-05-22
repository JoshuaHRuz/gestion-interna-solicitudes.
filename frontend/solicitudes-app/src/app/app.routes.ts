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
    loadChildren: () => import('./solicitudes/solicitudes.routes').then(r => r.SOLICITUDES_ROUTES),
    canActivate: [roleGuard], // Todos los usuarios autenticados pueden ver el dashboard genérico
    data: { roles: ['EMPLEADO', 'SUPERVISOR', 'ADMINISTRADOR'] as UserRole[] }
  },
  {
    path: 'solicitudes', // Rutas de empleado (Mis Solicitudes, Crear, Detalle)
    loadChildren: () => import('./solicitudes/solicitudes.routes').then(r => r.SOLICITUDES_ROUTES),
    canActivate: [roleGuard], // <-- Uso roleGuard
    data: { roles: ['EMPLEADO', 'SUPERVISOR', 'ADMINISTRADOR'] as UserRole[] } // Todos pueden acceder a SUS solicitudes
  },
/*   {
    path: 'perfil',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [roleGuard]
  }, */
  {
    path: 'supervisor', // NUEVA RUTA PARA EL SUPERVISOR
    loadComponent: () => import('./supervisor/supervisor-dashboard/supervisor-dashboard.component').then(c => c.SupervisorDashboardComponent),
    canActivate: [authGuard], // Asegura que solo usuarios autenticados puedan acceder
    data: { roles: ['SUPERVISOR', 'ADMINISTRADOR'] } // Opcional: Para una guardia de roles más avanzada
  },
  {
    path: 'supervisor/solicitud/:id', // MODIFICACIÓN 4: Nueva ruta para el detalle de la solicitud
    loadComponent: () => import('./supervisor/request-detail/request-detail.component').then(c => c.RequestDetailComponent),
    canActivate: [authGuard],
    data: { roles: ['SUPERVISOR', 'ADMINISTRADOR'] } // Solo supervisores/admins pueden ver el detalle
  },
  // { // Esto es un ejemplo que ya tenías, lo reemplazaré con las nuevas rutas de admin
  //   path: 'admin', // <-- FUTURA RUTA PARA ADMINISTRADORES
  //   loadChildren: () => import('./admin/admin.routes').then(r => r.ADMIN_ROUTES),
  //   canActivate: [roleGuard],
  //   data: { roles: ['ADMINISTRADOR'] as UserRole[] }
  // },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
    canActivate: [roleGuard],
    data: { roles: ['ADMINISTRADOR'] as UserRole[] }
  },
  {
    path: 'admin/solicitud/:id',
    loadComponent: () => import('./admin/admin-request-detail/admin-request-detail.component').then(c => c.AdminRequestDetailComponent),
    canActivate: [roleGuard],
    data: { roles: ['ADMINISTRADOR'] as UserRole[] }
  },
  // Considera añadir una ruta para 'admin/solicitud/nueva' si es necesario
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];