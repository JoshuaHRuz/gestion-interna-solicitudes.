package com.example.gestionsolicitudes.controller;

import com.example.gestionsolicitudes.domain.User;
import com.example.gestionsolicitudes.domain.UserRole;
import com.example.gestionsolicitudes.dto.JwtResponseDTO;
import com.example.gestionsolicitudes.dto.LoginRequestDTO;
import com.example.gestionsolicitudes.dto.RegisterRequestDTO;
import com.example.gestionsolicitudes.repository.UserRepository;
import com.example.gestionsolicitudes.security.jwt.JwtUtils;
// import com.example.gestionsolicitudes.security.services.UserDetailsImpl; // No se usa directamente UserDetailsImpl aquí
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

// @CrossOrigin(origins = "*", maxAge = 3600) // ELIMINADO - Se maneja globalmente via CorsConfig
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado después de la autenticación."));

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponseDTO(jwt,
                                                    user.getId(), 
                                                    user.getEmail(), 
                                                    user.getUsername(), 
                                                    roles,
                                                    user.getDepartment() != null ? user.getDepartment().name() : null));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: El correo electrónico ya está en uso!");
        }

        // Crear nuevo usuario
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setUsername(registerRequest.getUsername()); // Puede ser null si no se proporciona
        user.setRole(UserRole.EMPLEADO); // Por defecto, rol EMPLEADO
        // user.setDepartment(null); // Departamento puede ser asignado después o según lógica de negocio

        userRepository.save(user);

        // Opcional: autenticar inmediatamente después del registro
        // Authentication authentication = authenticationManager.authenticate(
        //         new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword()));
        // SecurityContextHolder.getContext().setAuthentication(authentication);
        // String jwt = jwtUtils.generateJwtToken(authentication);
        // ... construir JwtResponseDTO ...
        // return ResponseEntity.ok(new JwtResponseDTO(...));

        return ResponseEntity.ok("Usuario registrado exitosamente!");
    }
} 