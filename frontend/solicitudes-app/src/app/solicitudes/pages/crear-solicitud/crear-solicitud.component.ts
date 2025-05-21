import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes.service'; 
import { TiposSolicitudService } from '../../services/tipos-solicitud.service'; 
import { Solicitud, TipoSolicitud } from '../../../core/models/solicitud.model'; 

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  solicitudForm!: FormGroup;
  tiposSolicitud: TipoSolicitud[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private solicitudesService = inject(SolicitudesService); 
  private tiposSolicitudService = inject(TiposSolicitudService); 

  constructor() { }

  ngOnInit(): void {
    this.initForm();
    this.loadTiposSolicitud();
  }

  initForm(): void {
    this.solicitudForm = this.fb.group({
      tipo: ['', Validators.required],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      fechaMaxima: [null],
      urgente: [false]
    });
  }

  loadTiposSolicitud(): void {
    this.tiposSolicitudService.getTiposSolicitud().subscribe({
      next: (data) => {
        this.tiposSolicitud = data;
      },
      error: (err) => {
        console.error('Error al cargar tipos de solicitud:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.solicitudForm.valid) {
      const nuevaSolicitud: Solicitud = this.solicitudForm.value; // Aseguro el tipo
      this.solicitudesService.crearSolicitud(nuevaSolicitud).subscribe({
        next: (res) => {
          console.log('Solicitud creada con éxito', res);
          alert('Solicitud enviada con éxito!'); 
          this.router.navigate(['/solicitudes']);
        },
        error: (err) => {
          console.error('Error al crear solicitud:', err);
          alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      this.solicitudForm.markAllAsTouched();
      console.warn('Formulario inválido. Revise los campos.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/solicitudes']);
  }
}