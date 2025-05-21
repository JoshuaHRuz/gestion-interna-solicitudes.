package com.example.gestionsolicitudes.repository;

import com.example.gestionsolicitudes.domain.DepartmentType;
import com.example.gestionsolicitudes.domain.Request;
import com.example.gestionsolicitudes.domain.RequestStatus;
import com.example.gestionsolicitudes.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByDepartment(DepartmentType department);
    List<Request> findByRequester(User requester);
    List<Request> findByAssignedTo(User assignedTo);
    List<Request> findByStatus(RequestStatus status);
    // Ejemplo de consulta más compleja (contar por estado):
    // Long countByStatus(RequestStatus status);
} 