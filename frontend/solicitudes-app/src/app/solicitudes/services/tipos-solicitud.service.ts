import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TipoSolicitud } from '../../core/models/solicitud.model'; // Importo mi modelo

@Injectable({
  providedIn: 'root'
})
export class TiposSolicitudService {
  private apiUrl = 'http://localhost:8080/api/tipos-solicitud'; // URL de mi backend para tipos

  private http = inject(HttpClient);

  constructor() { }

  getTiposSolicitud(): Observable<TipoSolicitud[]> {
    // return this.http.get<TipoSolicitud[]>(this.apiUrl);

    const tiposSimulados: TipoSolicitud[] = [
      { id: 1, nombre: 'Licencia', descripcion: 'Solicitud de días libres.' },
      { id: 2, nombre: 'Compra', descripcion: 'Solicitud de materiales o servicios.' },
      { id: 3, nombre: 'Viaje', descripcion: 'Solicitud para viajes de negocio.' },
      { id: 4, nombre: 'Devolución', descripcion: 'Devolución de algún bien o servicio.' }
    ];
    return of(tiposSimulados).pipe(delay(300));
  }
}