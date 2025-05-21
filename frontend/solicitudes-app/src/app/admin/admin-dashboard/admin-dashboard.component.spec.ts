import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { RequestsService } from '../../services/requests.service';
import { AuthService } from '../../auth/services/auth.service';
import { of } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  // Mock para RequestsService
  const mockRequestsService = {
    getRequests: () => of([]), // Devuelve un observable vacío por defecto
    // Añade otros métodos que el dashboard pueda llamar si es necesario
  };

  // Mock para AuthService (si es necesario para el dashboard directamente)
  const mockAuthService = {
    // currentUser$: of(null), // o un usuario simulado
    // getCurrentUser: () => null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        AdminDashboardComponent, // Como es standalone, se importa directamente
        NoopAnimationsModule // Para evitar errores de animación en tests
      ],
      providers: [
        provideRouter([]), // Provee un router vacío para las pruebas
        { provide: RequestsService, useValue: mockRequestsService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Aquí puedes añadir más pruebas específicas para AdminDashboardComponent:
  // - Verificar que se cargan las solicitudes.
  // - Verificar que las métricas se calculan correctamente.
  // - Simular clics en botones y verificar navegación.
  // - etc.
}); 