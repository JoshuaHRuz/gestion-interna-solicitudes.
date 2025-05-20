import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Para obtener el ID de la ruta y para navegar
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs'; // Para simular observables
import { AprobacionPaso } from '../../../core/models/solicitud.model';
// Reutiliza la interfaz Solicitud del MisSolicitudesComponent o de un archivo de modelos compartido
import { SolicitudDetalle } from '../../../core/models/solicitud.model';
// Interfaz para el historial de aprobación


@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.css']
})
export class DetalleSolicitudComponent implements OnInit {
  solicitudId: number | null = null;
  solicitud: SolicitudDetalle | null = null;

  private route = inject(ActivatedRoute); // Para obtener parámetros de la URL
  private router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    // Obtener el ID de la solicitud de la URL y cargar los detalles
    this.route.paramMap.pipe(
      switchMap(params => {
        this.solicitudId = Number(params.get('id')); // Obtener el ID
        if (this.solicitudId) {
          return this.loadSolicitudDetalle(this.solicitudId); // Llamar a tu servicio
        }
        return of(null); // Si no hay ID, devuelve un observable nulo
      })
    ).subscribe(data => {
      this.solicitud = data;
      if (!this.solicitud) {
        // Manejar caso donde la solicitud no se encuentra
        console.warn('Solicitud no encontrada para ID:', this.solicitudId);
        
      }
    });
  }

  loadSolicitudDetalle(id: number): Observable<SolicitudDetalle | null> {
    // Simula la obtención de datos detallados del backend
    // return this.solicitudesService.getSolicitudDetalle(id);

    const solicitudesSimuladas: SolicitudDetalle[] = [
      {
        id: 1,
        tipo: 'Licencia',
        asunto: 'Vacaciones de verano',
        fechaCreacion: '2024-05-15',
        fechaMaxima: '2024-06-01',
        estado: 'Pendiente',
        descripcion: 'Solicito 15 días de vacaciones del 1 al 15 de junio.',
        urgente: false,
        historialAprobacion: [
          { etapa: 'Envío', responsable: 'Empleado A', fechaAccion: '2024-05-15', estado: 'Pendiente', comentarios: 'Solicitud enviada para revisión.' }
        ]
      },
      {
        id: 2,
        tipo: 'Compra',
        asunto: 'Material de oficina',
        fechaCreacion: '2024-05-10',
        fechaMaxima: '2024-05-20',
        estado: 'Aprobada',
        descripcion: 'Se requiere la compra de resmas de papel y tóner para impresora.',
        urgente: true,
        historialAprobacion: [
          { etapa: 'Envío', responsable: 'Empleado B', fechaAccion: '2024-05-10', estado: 'Pendiente', comentarios: 'Material necesario para el departamento.' },
          { etapa: 'Revisión Supervisor', responsable: 'Supervisor X', fechaAccion: '2024-05-12', estado: 'Aprobado', comentarios: 'Aprobado. Procede con la compra.' }
        ]
      },
      {
        id: 3,
        tipo: 'Viaje',
        asunto: 'Conferencia anual',
        fechaCreacion: '2024-05-08',
        estado: 'Rechazada',
        descripcion: 'Solicito viáticos para asistir a la conferencia "Tech Summit 2024" en Monterrey.',
        urgente: false,
        historialAprobacion: [
          { etapa: 'Envío', responsable: 'Empleado C', fechaAccion: '2024-05-08', estado: 'Pendiente', comentarios: 'Beneficioso para el desarrollo profesional.' },
          { etapa: 'Revisión Supervisor', responsable: 'Supervisor Y', fechaAccion: '2024-05-09', estado: 'Rechazado', comentarios: 'Presupuesto limitado para viajes este trimestre.' }
        ]
      }
    ];

    const found = solicitudesSimuladas.find(s => s.id === id);
    return of(found || null).pipe(); 
  }

  goBack(): void {
    this.router.navigate(['/solicitudes']); // Volver a la lista de solicitudes
  }
}