import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RequestsService, Request, Department } from '../../services/requests.service'; // Ajusta la ruta si es necesario
import { Observable, map } from 'rxjs';

interface Metric {
  title: string;
  value: number | string;
  icon?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private requestsService = inject(RequestsService);
  private router = inject(Router);

  public allRequests$: Observable<Request[]> = this.requestsService.getRequests();
  public metrics: Metric[] = [];

  // Columnas para la tabla de Angular Material
  displayedColumns: string[] = ['id', 'title', 'department', 'status', 'priority', 'requesterId', 'createdAt', 'actions'];

  // Filtros (opcional, se pueden añadir más adelante si es necesario)
  filterValues: { department?: Department, status?: Request['status'] } = {};
  availableDepartments: Department[] = ['IT', 'RRHH', 'FINANZAS', 'VENTAS', 'ADMINISTRACION', 'OPERACIONES'];
  availableStatuses: Request['status'][] = ['Pendiente', 'En Proceso', 'Completada', 'Rechazada', 'Aprobada', 'Devuelta'];

  ngOnInit(): void {
    this.allRequests$.subscribe(requests => {
      this.calculateMetrics(requests);
    });
  }

  calculateMetrics(requests: Request[]): void {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'Pendiente').length;
    const approvedRequests = requests.filter(r => r.status === 'Aprobada').length;
    const rejectedRequests = requests.filter(r => r.status === 'Rechazada').length;
    // Puedes añadir más métricas como el promedio de tiempo de resolución, etc.

    this.metrics = [
      { title: 'Total de Solicitudes', value: totalRequests, icon: 'list_alt' },
      { title: 'Pendientes', value: pendingRequests, icon: 'pending_actions' },
      { title: 'Aprobadas', value: approvedRequests, icon: 'thumb_up_off_alt' },
      { title: 'Rechazadas', value: rejectedRequests, icon: 'thumb_down_off_alt' }
    ];
  }

  viewRequestDetails(requestId: string): void {
    this.router.navigate(['/admin/solicitud', requestId]);
  }

  createNewRequest(): void {
    // Navega al componente de detalle en modo "creación"
    // 'new' es un identificador que AdminRequestDetailComponent deberá interpretar
    this.router.navigate(['/admin/solicitud', 'new']);
  }

  aplicarFiltros(): void { // Ejemplo si se implementan filtros
    this.allRequests$ = this.requestsService.getRequests().pipe(
      map(requests => requests.filter(req => {
        const departmentMatch = !this.filterValues.department || req.department === this.filterValues.department;
        const statusMatch = !this.filterValues.status || req.status === this.filterValues.status;
        return departmentMatch && statusMatch;
      }))
    );
    this.allRequests$.subscribe(requests => this.calculateMetrics(requests));
  }

  limpiarFiltros(): void { // Ejemplo si se implementan filtros
    this.filterValues = {};
    // Recargar todas las solicitudes sin filtrar
    this.allRequests$ = this.requestsService.getRequests(); 
    this.allRequests$.subscribe(requests => this.calculateMetrics(requests));
  }
}
