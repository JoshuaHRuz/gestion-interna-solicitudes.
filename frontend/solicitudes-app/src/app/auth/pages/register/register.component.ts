import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegistrationData } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  // MODIFICACIÓN 1: Declarar isLoading, errorMessage, successMessage
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // MODIFICACIÓN 2: Añadir minLength para username
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // MODIFICACIÓN 3: Cambiar el nombre del error del validador a 'passwordMismatch'
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    // Retorna null si coinciden, o un objeto de error si no
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    // Limpiar mensajes anteriores
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.valid) {
      this.isLoading = true; // Iniciar estado de carga
      const registrationData: RegistrationData = this.registerForm.value;

      this.authService.register(registrationData).subscribe({
        next: (response) => {
          console.log('Registro exitoso!', response);
          this.successMessage = 'Registro exitoso! Ahora puedes iniciar sesión.'; // Mostrar mensaje de éxito
          this.isLoading = false; // Finalizar estado de carga
          // Opcional: Navegar automáticamente después de un pequeño retraso
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); // Espera 2 segundos antes de navegar
        },
        error: (err: any) => {
          console.error('Error de registro:', err);
          this.isLoading = false; // Finalizar estado de carga
          this.errorMessage = err.message || 'Error en el registro. Por favor, inténtalo de nuevo.'; // Mostrar mensaje de error
        }
      });
    } else {
      this.registerForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar validación
      this.errorMessage = 'Por favor, corrige los errores en el formulario.'; // Mensaje general de error de validación
      console.warn('Formulario de registro inválido.');
    }
  }
}