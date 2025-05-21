package com.example.gestionsolicitudes.controller;

import com.example.gestionsolicitudes.domain.DepartmentType;
// import com.example.gestionsolicitudes.domain.Request; // No se necesita si el servicio ya usa la entidad
// import com.example.gestionsolicitudes.domain.RequestHistoryEntry; // No se necesita directamente
import com.example.gestionsolicitudes.dto.*;
import com.example.gestionsolicitudes.mapper.RequestHistoryEntryMapper;
import com.example.gestionsolicitudes.mapper.RequestMapper;
import com.example.gestionsolicitudes.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// import java.util.stream.Collectors; // No se necesita con el mapper

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;
    private final RequestMapper requestMapper;
    private final RequestHistoryEntryMapper requestHistoryEntryMapper;

    @Autowired
    public RequestController(RequestService requestService, RequestMapper requestMapper, RequestHistoryEntryMapper requestHistoryEntryMapper) {
        this.requestService = requestService;
        this.requestMapper = requestMapper;
        this.requestHistoryEntryMapper = requestHistoryEntryMapper;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLEADO', 'ADMINISTRADOR')")
    public ResponseEntity<RequestViewDTO> createRequest(@Valid @RequestBody RequestCreateDTO createDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // El mapeo de DTO a Entidad se puede hacer aquí o dentro del servicio.
        // Por consistencia, hagámoslo aquí antes de pasar al servicio.
        // El servicio esperará la entidad Request parcialmente poblada.
        com.example.gestionsolicitudes.domain.Request requestToCreate = requestMapper.requestCreateDTOToRequest(createDTO);
        
        com.example.gestionsolicitudes.domain.Request createdRequest = requestService.createRequest(requestToCreate, userDetails.getUsername(), createDTO.getAssignedToId());
        return new ResponseEntity<>(requestMapper.requestToRequestViewDTO(createdRequest), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<RequestViewDTO>> getAllRequests() {
        List<com.example.gestionsolicitudes.domain.Request> requests = requestService.findAllRequests();
        return ResponseEntity.ok(requestMapper.requestsToRequestViewDTOs(requests));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLEADO', 'SUPERVISOR', 'ADMINISTRADOR')")
    public ResponseEntity<RequestViewDTO> getRequestById(@PathVariable Long id) {
        return requestService.findRequestById(id)
                .map(requestMapper::requestToRequestViewDTO) // usa method reference
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMINISTRADOR')")
    public ResponseEntity<List<RequestViewDTO>> getRequestsByDepartment(@PathVariable DepartmentType department, Authentication authentication) {
        List<com.example.gestionsolicitudes.domain.Request> requests = requestService.findRequestsByDepartment(department);
        return ResponseEntity.ok(requestMapper.requestsToRequestViewDTOs(requests));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<RequestViewDTO> updateRequest(@PathVariable Long id, @Valid @RequestBody RequestUpdateDTO updateDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // Similar a create, el servicio recibirá la entidad parcialmente poblada
        com.example.gestionsolicitudes.domain.Request requestToUpdate = requestMapper.requestUpdateDTOToRequest(updateDTO);

        com.example.gestionsolicitudes.domain.Request updatedRequest = requestService.updateRequest(id, requestToUpdate, userDetails.getUsername(), updateDTO.getAssignedToId(), updateDTO.getComments());
        return ResponseEntity.ok(requestMapper.requestToRequestViewDTO(updatedRequest));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMINISTRADOR')")
    public ResponseEntity<RequestViewDTO> updateRequestStatus(@PathVariable Long id, @Valid @RequestBody RequestStatusUpdateDTO statusUpdateDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        com.example.gestionsolicitudes.domain.Request updatedRequest = requestService.updateRequestStatus(id, statusUpdateDTO.getStatus(), statusUpdateDTO.getComments(), userDetails.getUsername());
        return ResponseEntity.ok(requestMapper.requestToRequestViewDTO(updatedRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        requestService.deleteRequest(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("hasAnyRole('EMPLEADO', 'SUPERVISOR', 'ADMINISTRADOR')")
    public ResponseEntity<List<RequestHistoryEntryViewDTO>> getRequestHistory(@PathVariable Long id) {
        List<com.example.gestionsolicitudes.domain.RequestHistoryEntry> historyEntries = requestService.getRequestHistory(id);
        return ResponseEntity.ok(requestHistoryEntryMapper.historyEntriesToHistoryEntryViewDTOs(historyEntries));
    }
} 