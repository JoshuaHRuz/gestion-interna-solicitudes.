package com.example.gestionsolicitudes.service;

import com.example.gestionsolicitudes.domain.DepartmentType;
import com.example.gestionsolicitudes.domain.Request;
import com.example.gestionsolicitudes.domain.RequestHistoryEntry;
import com.example.gestionsolicitudes.domain.RequestStatus;
// Importar DTOs si se decide usarlos para entrada/salida
// Por ejemplo: import com.example.gestionsolicitudes.dto.RequestCreateDTO;
// import com.example.gestionsolicitudes.dto.RequestUpdateDTO;
// import com.example.gestionsolicitudes.dto.RequestViewDTO;

import java.util.List;
import java.util.Optional;

public interface RequestService {

    List<Request> findAllRequests();

    List<Request> findRequestsByDepartment(DepartmentType department);

    Optional<Request> findRequestById(Long id);

    Request createRequest(Request request, String userEmail, Long assignedToId); // userEmail para obtener el User solicitante, Añadido assignedToId

    Request updateRequest(Long id, Request requestDetails, String userEmail, Long assignedToId, String comments); // userEmail para auditoría y/o lógica específica, Añadido assignedToId y comments

    Request updateRequestStatus(Long id, RequestStatus newStatus, String comments, String userEmail);

    void deleteRequest(Long id, String userEmail); // userEmail para verificar permisos y auditoría

    List<RequestHistoryEntry> getRequestHistory(Long requestId);

    // Considerar métricas como parte de este servicio o uno dedicado
    // long countTotalRequests();
    // Map<RequestStatus, Long> countRequestsByStatus();
    // ...otras métricas
} 