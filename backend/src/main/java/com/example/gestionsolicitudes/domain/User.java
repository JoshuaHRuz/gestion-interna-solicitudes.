package com.example.gestionsolicitudes.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false)
    private String password;

    @Size(max = 100)
    private String username; // Opcional, como en el frontend

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private DepartmentType department; // Puede ser null si el rol no lo requiere (ej. Admin general)

    // Relaciones (si es necesario definir el lado inverso)
    // @OneToMany(mappedBy = "requester")
    // private Set<Request> createdRequests;

    // @OneToMany(mappedBy = "assignedTo")
    // private Set<Request> assignedRequests;

    // @OneToMany(mappedBy = "user")
    // private Set<RequestHistoryEntry> historyEntries;

    // Constructor personalizado si es necesario, Lombok proporciona @AllArgsConstructor y @NoArgsConstructor
} 