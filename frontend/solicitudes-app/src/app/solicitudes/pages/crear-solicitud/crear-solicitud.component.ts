import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { Router } from '@angular/router'; 
import { TipoSolicitud } from '../../../core/models/solicitud.model';
// --- Interfaces de Datos (MODELOS) ---
// Puedes mover estas interfaces a un archivo compartido, ej. `src/app/core/models/`

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importa ReactiveFormsModule aquí
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  solicitudForm!: FormGroup; // Declaración de un FormGroup
  tiposSolicitud: TipoSolicitud[] = []; // Para el dropdown de tipos de solicitud

  private fb = inject(FormBuilder); // Inyecta FormBuilder
  private router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    this.initForm();
    this.loadTiposSolicitud(); // Cargar los tipos de solicitud
  }

  initForm(): void {
    this.solicitudForm = this.fb.group({
      tipo: ['', Validators.required], // Campo para el ID o nombre del tipo de solicitud
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      fechaMaxima: [null], 
      urgente: [false] // Checkbox, por defecto false
    });
  }

  loadTiposSolicitud(): void {
    // Simula la obtención de tipos de solicitud del backend
    this.tiposSolicitud = [
      { id: 1, nombre: 'Licencia' },
      { id: 2, nombre: 'Compra' },
      { id: 3, nombre: 'Viaje' }
    ];
    // this.tiposSolicitudService.getTiposSolicitud().subscribe(data => {
    //   this.tiposSolicitud = data;
    // });
  }

  onSubmit(): void {
    if (this.solicitudForm.valid) {
      const nuevaSolicitud = this.solicitudForm.value;
      console.log('Datos de la nueva solicitud:', nuevaSolicitud);

      // Aquí llamaría al servicio para enviar la solicitud al backend
      // this.solicitudesService.crearSolicitud(nuevaSolicitud).subscribe({
      //   next: (res) => {
      //     console.log('Solicitud creada con éxito', res);
      //     this.router.navigate(['/solicitudes']); // Redirigir a "Mis Solicitudes"
      //     // O mostrar un mensaje de éxito
      //   },
      //   error: (err) => {
      //     console.error('Error al crear solicitud:', err);
      //     // Mostrar mensaje de error al usuario
      //   }
      // });

      // Simulación de envío exitoso y redirección
      alert('Solicitud enviada con éxito (simulado)!');
      this.router.navigate(['/solicitudes']);

    } else {
      // Marcar todos los campos como "touched" para mostrar errores de validación
      this.solicitudForm.markAllAsTouched();
      console.warn('Formulario inválido. Revise los campos.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/solicitudes']); // Volver a la lista de solicitudes
  }
}