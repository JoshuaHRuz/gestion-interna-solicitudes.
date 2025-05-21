import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Importa HttpClient
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Solicitud, SolicitudDetalle, TipoSolicitud } from '../../core/models/solicitud.model'; // <-- Importa mis modelos

@Injectable({
  providedIn: 'root' // Lo hago disponible en toda la aplicación
})
export class SolicitudesService {
  // Voy a definir una URL base para mi API de solicitudes (esto será configurable después)
  private apiUrl = 'http://localhost:8080/api/solicitudes'; // URL de mi backend

  private http = inject(HttpClient); // Inyecto HttpClient

  constructor() { }

  // --- Métodos para Solicitudes ---

  getMisSolicitudes(): Observable<Solicitud[]> {
    // En el futuro, haré una petición real a mi backend:
    // return this.http.get<Solicitud[]>(`${this.apiUrl}/mis-solicitudes`);

    // Por ahora, devuelvo datos simulados
    const solicitudesSimuladas: Solicitud[] = [
      { id: 1, tipo: 'Licencia', asunto: 'Vacaciones de verano', fechaCreacion: '2024-05-15', estado: 'Pendiente', fechaMaxima: '2024-06-01' },
      { id: 2, tipo: 'Compra', asunto: 'Material de oficina', fechaCreacion: '2024-05-10', estado: 'Aprobada', fechaMaxima: '2024-05-20' },
      { id: 3, tipo: 'Viaje', asunto: 'Conferencia anual', fechaCreacion: '2024-05-08', estado: 'Rechazada' },
      { id: 4, tipo: 'Licencia', asunto: 'Día personal', fechaCreacion: '2024-05-01', estado: 'Devuelta', fechaMaxima: '2024-05-05' }
    ];
    return of(solicitudesSimuladas).pipe(delay(500)); // Simulo un delay
  }

  getSolicitudDetalle(id: number): Observable<SolicitudDetalle | null> {
    // En el futuro, haré una petición real:
    // return this.http.get<SolicitudDetalle>(`<span class="math-inline">\{this\.apiUrl\}/</span>{id}`);

    // Datos simulados (deberían coincidir con los de MisSolicitudesComponent para este ejemplo)
    const solicitudesSimuladasDetalle: SolicitudDetalle[] = [
      {
        id: 1, tipo: 'Licencia', asunto: 'Vacaciones de verano', fechaCreacion: '2024-05-15', fechaMaxima: '2024-06-01', estado: 'Pendiente',
        descripcion: 'Solicito 15 días de vacaciones del 1 al 15 de junio.', urgente: false,
        historialAprobacion: [{ etapa: 'Envío', responsable: 'Empleado A', fechaAccion: '2024-05-15', estado: 'Pendiente', comentarios: 'Solicitud enviada para revisión.' }]
      },
      {
        id: 2, tipo: 'Compra', asunto: 'Material de oficina', fechaCreacion: '2024-05-10', fechaMaxima: '2024-05-20', estado: 'Aprobada',
        descripcion: 'Se requiere la compra de resmas de papel y tóner para impresora.', urgente: true,
        historialAprobacion: [
          { etapa: 'Envío', responsable: 'Empleado B', fechaAccion: '2024-05-10', estado: 'Pendiente', comentarios: 'Material necesario.' },
          { etapa: 'Revisión Supervisor', responsable: 'Supervisor X', fechaAccion: '2024-05-12', estado: 'Aprobado', comentarios: 'Aprobado. Procede.' }
        ]
      },
    ];
    const found = solicitudesSimuladasDetalle.find(s => s.id === id);
    return of(found || null).pipe(delay(500));
  }

  crearSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    // En el futuro, haré una petición POST real:
    // return this.http.post<Solicitud>(this.apiUrl, solicitud);

    // Simulación: asigno un ID y devuelvo el objeto
    console.log('Simulando creación de solicitud:', solicitud);
    const newId = Math.floor(Math.random() * 1000) + 10; // ID aleatorio
    return of({ ...solicitud, id: newId, fechaCreacion: new Date().toISOString().split('T')[0], estado: 'Pendiente' }).pipe(delay(1000));
  }

  // Más métodos como actualizarSolicitud, eliminarSolicitud, etc.
}