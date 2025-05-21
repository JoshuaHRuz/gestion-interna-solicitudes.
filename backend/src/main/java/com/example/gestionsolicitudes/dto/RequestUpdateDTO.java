package com.example.gestionsolicitudes.dto;

import com.example.gestionsolicitudes.domain.DepartmentType;
import com.example.gestionsolicitudes.domain.RequestPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RequestUpdateDTO {

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private DepartmentType department;

    @NotNull
    private RequestPriority priority;

    // El estado se actualiza por separado
    // El solicitante no debería cambiar
    private Long assignedToId; // Se puede reasignar
    private String comments; // Se puede añadir/modificar comentarios al editar la solicitud general
} 