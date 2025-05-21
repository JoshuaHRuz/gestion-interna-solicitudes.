package com.example.gestionsolicitudes.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "request_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestHistoryEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @CreationTimestamp // O podrías querer establecerlo manualmente al crear la entrada
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @NotBlank
    @Column(nullable = false)
    private String action;

    @Lob
    @Column(columnDefinition="TEXT")
    private String details; // Detalles adicionales, como el estado anterior/nuevo

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Usuario que realizó la acción

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;
} 