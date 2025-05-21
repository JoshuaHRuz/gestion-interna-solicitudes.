package com.example.gestionsolicitudes.service.impl;

import com.example.gestionsolicitudes.domain.*;
import com.example.gestionsolicitudes.repository.RequestHistoryRepository;
import com.example.gestionsolicitudes.repository.RequestRepository;
import com.example.gestionsolicitudes.repository.UserRepository;
import com.example.gestionsolicitudes.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RequestServiceImpl implements RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final RequestHistoryRepository requestHistoryRepository;

    @Autowired
    public RequestServiceImpl(RequestRepository requestRepository, 
                              UserRepository userRepository, 
                              RequestHistoryRepository requestHistoryRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.requestHistoryRepository = requestHistoryRepository;
    }

    @Override
    public List<Request> findAllRequests() {
        return requestRepository.findAll();
    }

    @Override
    public List<Request> findRequestsByDepartment(DepartmentType department) {
        return requestRepository.findByDepartment(department);
    }

    @Override
    public Optional<Request> findRequestById(Long id) {
        return requestRepository.findById(id);
    }

    @Override
    public Request createRequest(Request request, String userEmail, Long assignedToId) {
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + userEmail));
        request.setRequester(requester);
        request.setStatus(RequestStatus.PENDIENTE); 

        if (assignedToId != null) {
            User assignee = userRepository.findById(assignedToId)
                    .orElseThrow(() -> new RuntimeException("Usuario asignado no encontrado con ID: " + assignedToId));
            request.setAssignedTo(assignee);
        }
        
        Request savedRequest = requestRepository.save(request);
        
        RequestHistoryEntry historyEntry = new RequestHistoryEntry();
        historyEntry.setAction("Solicitud Creada");
        historyEntry.setUser(requester);
        historyEntry.setRequest(savedRequest);
        requestHistoryRepository.save(historyEntry);
        
        return savedRequest;
    }

    @Override
    public Request updateRequest(Long id, Request requestDetails, String userEmail, Long assignedToId, String commentsFromDTO) {
        User editor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario editor no encontrado: " + userEmail));
        
        Request existingRequest = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + id));

        existingRequest.setTitle(requestDetails.getTitle());
        existingRequest.setDescription(requestDetails.getDescription());
        existingRequest.setDepartment(requestDetails.getDepartment());
        existingRequest.setPriority(requestDetails.getPriority());
        existingRequest.setComments(commentsFromDTO); // Actualizar comentarios desde el DTO

        if (assignedToId != null) {
            if (existingRequest.getAssignedTo() == null || !existingRequest.getAssignedTo().getId().equals(assignedToId)) {
                User assignee = userRepository.findById(assignedToId)
                        .orElseThrow(() -> new RuntimeException("Usuario asignado no encontrado con ID: " + assignedToId));
                existingRequest.setAssignedTo(assignee);
            }
        } else {
            existingRequest.setAssignedTo(null); // Permitir desasignar
        }

        Request updatedRequest = requestRepository.save(existingRequest);

        RequestHistoryEntry historyEntry = new RequestHistoryEntry();
        historyEntry.setAction("Solicitud Editada");
        // TODO: Implementar getEditDifferences de forma más robusta, comparando campos
        historyEntry.setDetails("Campos actualizados por " + editor.getEmail() + ". Comentarios: " + (commentsFromDTO != null ? commentsFromDTO : "(sin cambios)")); 
        historyEntry.setUser(editor);
        historyEntry.setRequest(updatedRequest);
        requestHistoryRepository.save(historyEntry);

        return updatedRequest;
    }

    @Override
    public Request updateRequestStatus(Long id, RequestStatus newStatus, String comments, String userEmail) {
        User userUpdating = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + userEmail));
        
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + id));
        
        RequestStatus oldStatus = request.getStatus();
        request.setStatus(newStatus);
        request.setComments(comments);
        // request.setUpdatedAt(LocalDateTime.now()); // Lo maneja @UpdateTimestamp

        Request updatedRequest = requestRepository.save(request);

        RequestHistoryEntry historyEntry = new RequestHistoryEntry();
        historyEntry.setAction("Estado Actualizado");
        historyEntry.setDetails("Estado cambiado de " + oldStatus + " a " + newStatus + ". Comentarios: " + comments);
        historyEntry.setUser(userUpdating);
        historyEntry.setRequest(updatedRequest);
        requestHistoryRepository.save(historyEntry);

        return updatedRequest;
    }

    @Override
    public void deleteRequest(Long id, String userEmail) {
        User deleter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + userEmail));
        
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + id));

        // Aquí podrías añadir lógica de negocio, como no permitir borrar si no está en cierto estado,
        // o crear una entrada de historial ANTES de borrarla.
        // Por ahora, simplemente la borramos.
        // Considerar soft delete (marcar como borrada) en lugar de borrado físico.
        
        // Nota: El borrado en cascada de RequestHistoryEntry debería funcionar si está bien configurado en la entidad Request.
        requestRepository.delete(request);
        
        // Opcional: Crear una entrada de historial de eliminación (aunque la solicitud ya no existirá)
        // Esto sería más complejo, quizás registrarlo en un log de auditoría general.
    }

    @Override
    public List<RequestHistoryEntry> getRequestHistory(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + requestId));
        return requestHistoryRepository.findByRequestOrderByTimestampDesc(request);
    }
} 