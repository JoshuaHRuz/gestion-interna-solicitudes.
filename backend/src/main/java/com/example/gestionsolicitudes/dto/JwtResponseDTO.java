package com.example.gestionsolicitudes.dto;

import lombok.Data;
// import lombok.RequiredArgsConstructor; // No es estrictamente necesario si tenemos el constructor completo

import java.util.List;

@Data
public class JwtResponseDTO {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String username; // Opcional, si lo devuelves
    private List<String> roles;
    private String department; // Opcional, si el usuario tiene uno y es relevante

    public JwtResponseDTO(String token, Long id, String email, String username, List<String> roles, String department) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.username = username;
        this.roles = roles;
        this.department = department;
    }
} 