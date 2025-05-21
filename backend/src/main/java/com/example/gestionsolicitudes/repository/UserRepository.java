package com.example.gestionsolicitudes.repository;

import com.example.gestionsolicitudes.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    // Podríamos añadir más métodos de búsqueda si son necesarios, por ejemplo:
    // Optional<User> findByUsername(String username);
    // Boolean existsByUsername(String username);
} 