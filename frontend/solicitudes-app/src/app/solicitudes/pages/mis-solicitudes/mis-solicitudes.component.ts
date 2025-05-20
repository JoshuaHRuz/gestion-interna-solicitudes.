import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Para el botón "Nueva Solicitud" y "Ver detalle"
import { Solicitud } from '../../../core/models/solicitud.model';


@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importa RouterLink para la navegación declarativa
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = []; // Array para almacenar las solicitudes del empleado
  private router = inject(Router); // Inyecta el Router para navegación programática

  constructor() { }

  ngOnInit(): void {
    // Aquí es donde llamarías a un servicio para cargar las solicitudes del usuario logueado.
    // Por ahora, usamos datos simulados.
    this.loadMisSolicitudes();
  }

  loadMisSolicitudes(): void {
    // Simula la obtención de datos del backend
    this.solicitudes = [
      { id: 1, tipo: 'Licencia', asunto: 'Vacaciones de verano', fechaCreacion: '2024-05-15', estado: 'Pendiente', fechaMaxima: '2024-06-01' },
      { id: 2, tipo: 'Compra', asunto: 'Material de oficina', fechaCreacion: '2024-05-10', estado: 'Aprobada', fechaMaxima: '2024-05-20' },
      { id: 3, tipo: 'Viaje', asunto: 'Conferencia anual', fechaCreacion: '2024-05-08', estado: 'Rechazada' },
      { id: 4, tipo: 'Licencia', asunto: 'Día personal', fechaCreacion: '2024-05-01', estado: 'Devuelta', fechaMaxima: '2024-05-05' }
    ];

  }

  verDetalle(id: number): void {
    // Navegación programática al detalle de la solicitud
    this.router.navigate(['/solicitudes', id]);
  }

   nuevaSolicitud(): void {
     this.router.navigate(['/solicitudes/crear']);
   }
}