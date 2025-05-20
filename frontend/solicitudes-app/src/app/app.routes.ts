// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    // Ejemplo de carga perezosa de un solo componente standalone
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    // title: 'Dashboard'
  },
  {
    path: 'solicitudes',
  },
  // {
  //   path: 'usuarios',
  //   loadChildren: () => import('./usuarios/usuarios.routes').then(r => r.USUARIOS_ROUTES)
  // },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Ruta por defecto
  // {
  //   path: '**', // Wildcard route for a 404 page
  //   loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent),
  //   title: 'Página no encontrada'
  // }
];