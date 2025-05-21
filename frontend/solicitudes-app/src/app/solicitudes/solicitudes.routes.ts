// src/app/solicitudes/solicitudes.routes.ts
import { Routes } from '@angular/router';

// Componentes a crear en los siguientes pasos
// import { MisSolicitudesComponent } from './pages/mis-solicitudes/mis-solicitudes.component'; // Para el listado del empleado
// import { CrearSolicitudComponent } from './pages/crear-solicitud/crear-solicitud.component'; // Para el formulario
// import { DetalleSolicitudComponent } from './pages/detalle-solicitud/detalle-solicitud.component'; // Para el detalle

export const SOLICITUDES_ROUTES: Routes = [
  {
    path: '', // Ruta base: /solicitudes -> Mis Solicitudes
    loadComponent: () => import('./pages/mis-solicitudes/mis-solicitudes.component').then(c => c.MisSolicitudesComponent),
    title: 'Mis Solicitudes'
  },
  {
    path: 'crear', // /solicitudes/crear -> Formulario de nueva solicitud
    loadComponent: () => import('./pages/crear-solicitud/crear-solicitud.component').then(c => c.CrearSolicitudComponent),
    title: 'Nueva Solicitud'
  },
  {
    path: ':id', // /solicitudes/:id -> Detalle de una solicitud específica
    loadComponent: () => import('./pages/detalle-solicitud/detalle-solicitud.component').then(c => c.DetalleSolicitudComponent),
    title: 'Detalle de Solicitud'
  },
  // Puedes añadir rutas para editar solicitudes si lo necesitas, por ejemplo:
  // {
  //   path: ':id/editar',
  //   loadComponent: () => import('./pages/editar-solicitud/editar-solicitud.component').then(c => c.EditarSolicitudComponent),
  //   title: 'Editar Solicitud'
  // }
];