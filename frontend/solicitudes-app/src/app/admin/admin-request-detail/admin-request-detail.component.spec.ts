import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms'; // Necesario para FormGroup
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Para MatSnackBar
import { Observable } from 'rxjs';

import { AdminRequestDetailComponent } from './admin-request-detail.component';
import { RequestsService, Request } from '../../services/requests.service';
import { AuthService } from '../../auth/services/auth.service';
import { of } from 'rxjs';

describe('AdminRequestDetailComponent', () => {
  let component: AdminRequestDetailComponent;
  let fixture: ComponentFixture<AdminRequestDetailComponent>;

  const mockRequestsService = {
    getRequestById: (id: string): Observable<Request | undefined> => of(undefined), // Permitir Request | undefined
    getRequestHistory: (id: string) => of([]),
    createRequest: (req: any, by: string) => of({ ...req, id: 'new123' } as Request),
    editRequest: (req: any, by: string) => of(req as Request),
    deleteRequest: (id: string) => of(true),
  };

  const mockAuthService = {
    getCurrentUser: () => ({ email: 'admin@test.com', role: 'ADMINISTRADOR' }), // Simula un admin
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => 'new' // Por defecto simula estar en modo 'creación'
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminRequestDetailComponent, // Standalone
        ReactiveFormsModule,      // Para el formulario
        MatSnackBarModule,        // Para MatSnackBar
        NoopAnimationsModule      // Para animaciones
      ],
      providers: [
        provideRouter([]), // Router vacío
        { provide: RequestsService, useValue: mockRequestsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Pruebas para modo 'new' (creación)
  describe('when in create mode', () => {
    it('should initialize form for new request', () => {
      expect(component.isEditMode).toBeFalse();
      expect(component.requestForm).toBeDefined();
      expect(component.requestForm.get('title')?.value).toEqual('');
    });

    // Añadir pruebas para guardar nueva solicitud, etc.
  });

  // Pruebas para modo 'edit' (edición)
  describe('when in edit mode', () => {
    beforeEach(() => {
      // Cambiar el mock de ActivatedRoute para simular modo edición
      (TestBed.inject(ActivatedRoute).snapshot.paramMap.get as jasmine.Spy).and.returnValue('req123');
      // Simular que el servicio devuelve una solicitud
      (mockRequestsService.getRequestById as jasmine.Spy).and.returnValue(of({
        id: 'req123', title: 'Test Request', description: 'Desc', department: 'IT',
        status: 'Pendiente', priority: 'Media', requesterId: 'emp1', createdAt: new Date()
      } as Request));
      
      component.ngOnInit(); // Re-llamar ngOnInit para cargar datos de edición
      fixture.detectChanges();
    });

    it('should initialize form for editing request and set isEditMode to true', () => {
      expect(component.isEditMode).toBeTrue();
      expect(component.requestId).toBe('req123');
      expect(component.requestForm.get('title')?.value).toEqual('Test Request');
    });

    // Añadir pruebas para actualizar, eliminar, cargar historial, etc.
  });

  // Más pruebas:
  // - Validaciones del formulario
  // - Llamadas a snackBar
  // - Navegación después de acciones
}); 