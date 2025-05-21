// src/app/supervisor/request-detail/request-detail.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Importar RouterLink también
import { RequestsService, Request } from '../../services/requests.service';
import { AuthUser, AuthService, Department } from '../../auth/services/auth.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // Para el selector de estado
import { FormsModule } from '@angular/forms';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para ngModel en el select y textarea

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule, // Para el botón de volver
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule // Necesario para ngModel
  ],
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private requestsService = inject(RequestsService);
  private authService = inject(AuthService);

  request: Request | undefined;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: AuthUser | null = null;

  // Propiedades para el formulario de actualización
  selectedStatus: Request['status'] = 'Pendiente'; // Estado inicial
  comments: string = '';

  // Opciones de estado para el selector (ajustar según tus necesidades)
  statusOptions: Request['status'][] = ['Pendiente', 'En Proceso', 'Completada', 'Rechazada', 'Devuelta', 'Completada'];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.route.paramMap.subscribe(params => {
      const requestId = params.get('id');
      if (requestId) {
        this.loadRequestDetails(requestId);
      } else {
        this.errorMessage = 'ID de solicitud no proporcionado.';
        console.error(this.errorMessage);
        this.router.navigate(['/supervisor']); // Redirigir si no hay ID
      }
    });
  }

  loadRequestDetails(id: string): void {
    this.isLoading = true;
    this.requestsService.getRequestById(id).subscribe(
      req => {
        if (req) {
          // Verificar si el supervisor tiene permiso para ver esta solicitud por departamento
          if (this.currentUser?.role === 'SUPERVISOR' && this.currentUser.department !== req.department) {
            this.errorMessage = 'No tienes permiso para ver solicitudes de otros departamentos.';
            this.request = undefined; // No mostrar la solicitud
            this.isLoading = false;
            // Opcional: redirigir después de un tiempo
            setTimeout(() => this.router.navigate(['/supervisor']), 3000);
            return;
          }

          this.request = req;
          this.selectedStatus = req.status; // Establecer el estado actual de la solicitud en el selector
          this.comments = req.comments || ''; // Cargar comentarios existentes
          this.isLoading = false;
        } else {
          this.errorMessage = 'Solicitud no encontrada.';
          console.warn(this.errorMessage);
          this.isLoading = false;
          this.router.navigate(['/supervisor']); // Redirigir si no se encuentra
        }
      },
      error => {
        this.errorMessage = `Error al cargar la solicitud: ${error.message}`;
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  // Método para actualizar el estado de la solicitud
  updateRequest(): void {
    // Validación adicional en TypeScript, aunque el botón HTML ya lo controla
    if (!this.request || !this.selectedStatus || !this.comments.trim()) { // <--- Añadido .trim() para evitar solo espacios
      this.errorMessage = 'Por favor, selecciona un estado y proporciona un comentario.';
      this.successMessage = null; // Limpiar éxito si hay error
      return; // Detener la ejecución si la validación falla
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.requestsService.updateRequestStatus(this.request.id, this.selectedStatus, this.comments).subscribe(
      updatedReq => {
        this.request = updatedReq;
        this.successMessage = 'Estado de solicitud actualizado con éxito.';
        this.isLoading = false;
        console.log('Solicitud actualizada:', updatedReq);
      },
      error => {
        this.errorMessage = `Error al actualizar la solicitud: ${error.message}`;
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/supervisor']);
  }
}