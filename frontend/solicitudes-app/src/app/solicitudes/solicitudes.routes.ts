import { Routes } from '@angular/router';
import { SolicitudesDashboardComponent } from './pages/solicitudes-dashboard/solicitudes-dashboard.component';
// Importa otros componentes si tienes más sub-rutas, ej: SolicitudCreateComponent, SolicitudDetailComponent

export const SOLICITUDES_ROUTES: Routes = [
  {
    path: '', // Ruta base para '/solicitudes'
    component: SolicitudesDashboardComponent,
    // title: 'Gestión de Solicitudes' // Opcional: para el título del navegador
  },
  // Ejemplo de sub-rutas:
  // {
  //   path: 'nueva',
  //   loadComponent: () => import('./pages/solicitud-create/solicitud-create.component').then(c => c.SolicitudCreateComponent),
  //   title: 'Nueva Solicitud'
  // },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./pages/solicitud-detail/solicitud-detail.component').then(c => c.SolicitudDetailComponent),
  //   title: 'Detalle de Solicitud'
  // }
];