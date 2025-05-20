import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs'; // Importo Observable
import { SolicitudesService } from '../../services/solicitudes.service'; // <-- Importo el servicio
import { SolicitudDetalle } from '../../../core/models/solicitud.model'; // <-- Importo mi modelo

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

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitudesService = inject(SolicitudesService); // <-- Inyecto el servicio

  constructor() { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.solicitudId = Number(params.get('id'));
        if (this.solicitudId) {
          return this.solicitudesService.getSolicitudDetalle(this.solicitudId); // <-- Uso el servicio aquí
        }
        return of(null);
      })
    ).subscribe(data => {
      this.solicitud = data;
      if (!this.solicitud) {
        console.warn('Solicitud no encontrada para ID:', this.solicitudId);
        // Podría redirigir o mostrar un mensaje de error
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/solicitudes']);
  }
}