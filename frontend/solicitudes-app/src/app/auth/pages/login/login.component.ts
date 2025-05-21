import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    // CAMBIO AQUI: Ahora el formulario de login espera 'email' y 'password'
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // <--- AÑADIR VALIDATOR.EMAIL Y CAMBIAR A 'email'
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      this.isLoading = true;
      // IMPORTANTE: Si tu servicio AuthService.login() sigue esperando un 'username' y un 'password' separados
      // NECESITARÁS AJUSTAR LA LLAMADA.
      // Por ejemplo, si tu AuthService.login(username: string, password: string)
      // tendrías que pasar: this.authService.login(credentials.email, credentials.password)
      // Pero dado que ya lo habíamos ajustado para recibir un objeto 'credentials', esto debería funcionar:
      const credentials: LoginCredentials = this.loginForm.value; // Esto ahora tendrá { email: '...', password: '...' }

      // Aquí, tu servicio de autenticación DEBE SABER que ahora recibe un email.
      // Si tu AuthService.login espera 'username', necesitarás mapear `credentials.email` a `username`
      // O cambiar la interfaz LoginCredentials y la implementación de AuthService.login
      // para que acepte 'email' en lugar de 'username'.

      // Suponiendo que tu AuthService.login() está listo para manejar { email: string, password: string }
      // O que tu AuthService.login() mapeará el email a un username de forma interna para la simulación:
      this.authService.login({
        email: credentials.email, // <--- **MUY IMPORTANTE:** Envío el email como 'username' a la simulación
        password: credentials.password
      }).subscribe({
        next: (response) => {
          console.log('Login exitoso!', response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error de login:', err);
          this.isLoading = false;
          this.errorMessage = err.message || 'Credenciales inválidas. Inténtalo de nuevo.';
          // Si el error viene del AuthService que esperaba un username y recibió email, podría ser este.
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Por favor, introduce tu correo electrónico y contraseña.';
    }
  }
}