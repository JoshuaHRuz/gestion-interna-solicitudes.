// src/app/supervisor/supervisor-dashboard/supervisor-dashboard.component.ts

import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RequestsService, Request } from '../../services/requests.service';
import { AuthService, AuthUser, Department } from '../../auth/services/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Para MatTable
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Para paginación
import { MatSort, MatSortModule } from '@angular/material/sort'; // Para ordenación
import { MatCardModule } from '@angular/material/card'; // Para tarjetas
import { MatButtonModule } from '@angular/material/button'; // Para botones
import { MatIconModule } from '@angular/material/icon'; // Para iconos
import { MatFormFieldModule } from '@angular/material/form-field'; // Para campos de formulario
import { MatInputModule } from '@angular/material/input'; // Para inputs

@Component({
  selector: 'app-supervisor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.css']
})
export class SupervisorDashboardComponent implements OnInit {
  private requestsService = inject(RequestsService);
  private authService = inject(AuthService);

  currentUser: AuthUser | null = null;
  department: Department | undefined; // Departamento del supervisor

  displayedColumns: string[] = ['id', 'title', 'department', 'status', 'priority', 'requesterId', 'createdAt', 'actions'];
  dataSource!: MatTableDataSource<Request>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Solo cargar solicitudes si el usuario es supervisor y tiene departamento
      if (this.currentUser?.role === 'SUPERVISOR' && this.currentUser.department) {
        this.department = this.currentUser.department;
        this.loadRequests();
      } else {
        // Manejar caso donde no es supervisor o no tiene departamento
        console.warn('Acceso no autorizado o sin departamento asignado para el supervisor.');
        // Podrías redirigir o mostrar un mensaje de error
      }
    });
  }

  loadRequests(): void {
    if (this.department) {
      this.requestsService.getRequestsByDepartment(this.department).subscribe(
        (requests: Request[]) => {
          this.dataSource = new MatTableDataSource(requests);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => {
          console.error('Error al cargar solicitudes:', error);
          // Manejar el error, mostrar un mensaje al usuario, etc.
        }
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Ejemplo de acción (puedes expandir esto)
  viewRequest(request: Request): void {
    console.log('Ver detalles de la solicitud:', request.id);
    // Aquí puedes navegar a un componente de detalle o abrir un diálogo
  }

  updateStatus(request: Request, newStatus: 'Pendiente' | 'En Proceso' | 'Completada' | 'Rechazada'): void {
    this.requestsService.updateRequestStatus(request.id, newStatus).subscribe(
      updatedReq => {
        console.log('Solicitud actualizada:', updatedReq);
        // Actualizar la tabla para reflejar el cambio (recargar o actualizar el elemento específico)
        this.loadRequests(); // La forma más simple, pero podrías actualizar solo la fila
      },
      error => {
        console.error('Error al actualizar estado:', error);
      }
    );
  }
}