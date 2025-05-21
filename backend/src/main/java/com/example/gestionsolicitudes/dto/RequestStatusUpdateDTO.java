package com.example.gestionsolicitudes.dto;

import com.example.gestionsolicitudes.domain.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequestStatusUpdateDTO {
    @NotNull
    private RequestStatus status;

    @NotBlank // Comentario obligatorio al cambiar estado, como se mencionó
    private String comments;
} 