import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Solicitud } from '../../../core/models/solicitud.model'; // Importo el modelo centralizado
import { SolicitudesService } from '../../services/solicitudes.service'; // <-- Importo mi servicio

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  private router = inject(Router);
  private solicitudesService = inject(SolicitudesService); // <-- Inyecto el servicio

  constructor() { }

  ngOnInit(): void {
    this.loadMisSolicitudes();
  }

  loadMisSolicitudes(): void {
    this.solicitudesService.getMisSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (err) => {
        console.error('Error al cargar mis solicitudes:', err);
        // Aquí manejaría el error, por ejemplo, mostrando un mensaje al usuario
      }
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/solicitudes', id]);
  }
}