package com.example.gestionsolicitudes.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RequestHistoryEntryViewDTO {
    private Long id;
    private LocalDateTime timestamp;
    private String action;
    private String details;
    private String userEmail; // o UserViewDTO
    // No incluimos el RequestDTO aquí para evitar referencias circulares si se anida
} 