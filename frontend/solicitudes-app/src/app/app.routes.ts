// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.component').then(c => c.LoginComponent),
    title: 'Iniciar Sesión'
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register/register.component').then(c => c.RegisterComponent),
    title: 'Registro'
  },
  {
    path: 'dashboard', // Ejemplo de ruta protegida
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard], // Proteger esta ruta
    title: 'Dashboard'
  },
  {
    path: 'solicitudes', // Ejemplo de ruta protegida
    loadChildren: () => import('./solicitudes/solicitudes.routes').then(r => r.SOLICITUDES_ROUTES),
    canActivate: [authGuard], // Proteger esta sección
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Ruta por defecto
  // {
  //   path: '**', // Wildcard route for a 404 page
  //   loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent),
  //   title: 'Página no encontrada'
  // }
];