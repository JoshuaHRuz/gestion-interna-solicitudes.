package com.example.gestionsolicitudes.dto;

import com.example.gestionsolicitudes.domain.DepartmentType;
import com.example.gestionsolicitudes.domain.RequestPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RequestCreateDTO {

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    private String description; // @Lob no es necesario aquí, es para la entidad

    @NotNull
    private DepartmentType department;

    @NotNull
    private RequestPriority priority;

    // requesterId se obtendrá del usuario autenticado en el servicio
    // assignedToId podría ser opcional al crear
    private Long assignedToId; 
} 