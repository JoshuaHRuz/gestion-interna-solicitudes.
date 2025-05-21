// src/app/auth/models/auth.models.ts

export interface UserCredentials {
  email: string;
  password?: string; // Password es opcional si solo envías email para ciertas acciones
}

export interface RegistrationData {
  username: string;
  email: string;
  password?: string;
  // Podrías añadir 'confirmPassword' aquí si lo manejas en el modelo,
  // pero usualmente es solo para validación del formulario.
}

export interface AuthResponse {
  token: string;
  userId: string; // o number
  username: string;
  email: string;
  roles: string[];
}