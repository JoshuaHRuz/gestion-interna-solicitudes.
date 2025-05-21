package com.example.gestionsolicitudes.dto;

import com.example.gestionsolicitudes.domain.DepartmentType;
import com.example.gestionsolicitudes.domain.RequestPriority;
import com.example.gestionsolicitudes.domain.RequestStatus;
import lombok.Data;

import java.time.LocalDateTime;
// Podríamos añadir un DTO para el historial también si es necesario
// import java.util.List;

@Data
public class RequestViewDTO {
    private Long id;
    private String title;
    private String description;
    private DepartmentType department;
    private RequestStatus status;
    private RequestPriority priority;
    private String requesterEmail; // o UserViewDTO
    private String assignedToEmail; // o UserViewDTO, opcional
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String comments;
    // private List<RequestHistoryEntryViewDTO> history; // Si decidimos incluirlo aquí
} 