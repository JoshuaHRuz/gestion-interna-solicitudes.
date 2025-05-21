package com.example.gestionsolicitudes.dto;

import com.example.gestionsolicitudes.domain.DepartmentType;
import com.example.gestionsolicitudes.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotBlank
    @Size(max = 255)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 120) // Añadir validación de longitud para la contraseña
    private String password;

    @Size(max = 100)
    private String username; // Opcional

    // Estos campos podrían ser asignados por un admin o en un flujo más complejo
    // Por ahora, un usuario se registra como EMPLEADO por defecto.
    // Si se permite al usuario elegir rol/departamento al registrarse (poco común para EMPLEADO):
    // private UserRole role; 
    // private DepartmentType department;
} 