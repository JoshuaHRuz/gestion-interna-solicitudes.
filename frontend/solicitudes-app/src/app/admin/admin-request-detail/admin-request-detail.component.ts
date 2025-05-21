import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RequestsService, Request, Department, RequestHistoryEntry } from '../../services/requests.service';
import { AuthService, UserRole } from '../../auth/services/auth.service'; // Asumiendo que este servicio existe y provee el usuario actual
import { Observable, switchMap, tap, of, filter } from 'rxjs';

@Component({
  selector: 'app-admin-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatListModule,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './admin-request-detail.component.html',
  styleUrls: ['./admin-request-detail.component.css']
})
export class AdminRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private requestsService = inject(RequestsService);
  private authService = inject(AuthService); // Para obtener el ID del admin
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  requestForm!: FormGroup;
  isEditMode = false;
  requestId: string | null = null;
  currentRequest: Request | null = null;
  requestHistory$: Observable<RequestHistoryEntry[] | undefined> = of(undefined);

  // Opciones para los selectores del formulario
  departments: Department[] = ['IT', 'RRHH', 'FINANZAS', 'VENTAS', 'ADMINISTRACION', 'OPERACIONES'];
  statuses: Request['status'][] = ['Pendiente', 'En Proceso', 'Completada', 'Rechazada', 'Aprobada', 'Devuelta'];
  priorities: Request['priority'][] = ['Baja', 'Media', 'Alta'];
  // Simulación de IDs de usuarios para el campo requesterId y assignedTo
  // En una app real, esto vendría de un servicio de usuarios
  // mockUserIds: string[] = ['empleado1', 'empleado2', 'empleado3', 'empleado4', 'empleado5', 'supervisor1', 'admin1'];
  simulatedUsers: { id: string, displayName: string }[] = [
    { id: 'empleado1@emqu.com', displayName: 'Empleado 1 (empleado1@emqu.com)' },
    { id: 'empleado2@emqu.com', displayName: 'Empleado 2 (empleado2@emqu.com)' },
    { id: 'supervisor.it@emqu.com', displayName: 'Supervisor IT (supervisor.it@emqu.com)' },
    { id: 'admin.general@emqu.com', displayName: 'Admin General (admin.general@emqu.com)' },
    { id: 'jefe.rrhh@emqu.com', displayName: 'Jefe RRHH (jefe.rrhh@emqu.com)' }
  ];

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.requestId && this.requestId !== 'new';

    this.initForm();

    if (this.isEditMode && this.requestId) {
      this.loadRequestData(this.requestId);
      this.requestHistory$ = this.requestsService.getRequestHistory(this.requestId);
    } else {
      // Valores por defecto para nueva solicitud si es necesario
      this.requestForm.patchValue({
        status: 'Pendiente',
        priority: 'Media',
        // requesterId: this.authService.getCurrentUser()?.id // Asignar el admin actual como solicitante por defecto?
      });
    }
  }

  initForm(): void {
    this.requestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      department: [null, Validators.required],
      status: [{ value: 'Pendiente', disabled: !this.isEditMode && false }, Validators.required], // Admin puede cambiar estado siempre
      priority: [null, Validators.required],
      requesterId: ['', Validators.required], // Admin puede especificar quién solicita
      assignedTo: [''], // Opcional, admin puede asignar
      comments: [''] // Nuevo campo para comentarios del admin
    });
  }

  loadRequestData(id: string): void {
    this.requestsService.getRequestById(id).pipe(
      filter((req): req is Request => !!req), // Asegura que req no es undefined
      tap(request => {
        this.currentRequest = request;
        this.requestForm.patchValue({
          title: request.title,
          description: request.description,
          department: request.department,
          status: request.status,
          priority: request.priority,
          requesterId: request.requesterId,
          assignedTo: request.assignedTo || '',
          comments: request.comments || '' // Cargar comentarios existentes
        });
        // El admin puede editar todos los campos, así que no deshabilitamos nada por defecto aquí.
        // this.requestForm.get('status')?.enable(); // Asegurar que el status sea editable
      })
    ).subscribe({
      error: () => this.showError('Error al cargar la solicitud.')
    });
  }

  saveRequest(): void {
    if (this.requestForm.invalid) {
      this.showError('Por favor, complete todos los campos requeridos.');
      return;
    }

    const currentUser = this.authService.getCurrentUser(); // Asumo que tienes un método así
    if (!currentUser || currentUser.role !== 'ADMINISTRADOR') {
      this.showError('Acción no permitida o usuario no autenticado.');
      return;
    }
    const adminUserIdentifier = currentUser.email; // Usar email como identificador del admin

    const formValues = this.requestForm.getRawValue(); // getRawValue para incluir campos deshabilitados si los hubiera

    if (this.isEditMode && this.currentRequest) {
      const updatedRequest: Request = {
        ...this.currentRequest, // Mantiene campos no editables como id, createdAt, history
        ...formValues,
        updatedAt: new Date(),
      };
      this.requestsService.editRequest(updatedRequest, adminUserIdentifier).subscribe({
        next: () => {
          this.showSuccess('Solicitud actualizada correctamente.');
          this.router.navigate(['/admin']);
        },
        error: (err) => this.showError(err.message || 'Error al actualizar la solicitud.')
      });
    } else {
      // Creación de nueva solicitud
      const newRequestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'history'> = {
        title: formValues.title,
        description: formValues.description,
        department: formValues.department,
        status: formValues.status || 'Pendiente', // Status por defecto si no se especifica o es 'new'
        priority: formValues.priority,
        requesterId: formValues.requesterId, // Admin define quién es el solicitante
        assignedTo: formValues.assignedTo || undefined
      };
      this.requestsService.createRequest(newRequestData, adminUserIdentifier).subscribe({
        next: () => {
          this.showSuccess('Solicitud creada correctamente.');
          this.router.navigate(['/admin']);
        },
        error: (err) => this.showError(err.message || 'Error al crear la solicitud.')
      });
    }
  }

  deleteRequest(): void {
    if (!this.isEditMode || !this.currentRequest || !this.currentRequest.id) {
      this.showError('No se puede eliminar una solicitud que no existe.');
      return;
    }
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMINISTRADOR') {
      this.showError('Acción no permitida.');
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar esta solicitud? Esta acción no se puede deshacer.')) {
      this.requestsService.deleteRequest(this.currentRequest.id).subscribe({
        next: () => {
          this.showSuccess('Solicitud eliminada correctamente.');
          this.router.navigate(['/admin']);
        },
        error: (err) => this.showError(err.message || 'Error al eliminar la solicitud.')
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/admin']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: 'success-snackbar' });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 5000, panelClass: 'error-snackbar' });
  }
}
