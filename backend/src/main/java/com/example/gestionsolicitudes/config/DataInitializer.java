package com.example.gestionsolicitudes.config;

import com.example.gestionsolicitudes.domain.DepartmentType;
import com.example.gestionsolicitudes.domain.User;
import com.example.gestionsolicitudes.domain.UserRole;
import com.example.gestionsolicitudes.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear Administrador por defecto si no existe
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Cambia esta contraseña!
            admin.setUsername("Admin General");
            admin.setRole(UserRole.ADMINISTRADOR);
            // Los administradores generales podrían no tener un departamento específico
            // admin.setDepartment(DepartmentType.ADMINISTRACION); 
            userRepository.save(admin);
            System.out.println("Usuario Administrador por defecto creado.");
        }

        // Crear Supervisor de IT por defecto si no existe
        if (!userRepository.existsByEmail("supervisor.it@example.com")) {
            User supervisorIT = new User();
            supervisorIT.setEmail("supervisor.it@example.com");
            supervisorIT.setPassword(passwordEncoder.encode("supIT123")); // Cambia esta contraseña!
            supervisorIT.setUsername("Supervisor de IT");
            supervisorIT.setRole(UserRole.SUPERVISOR);
            supervisorIT.setDepartment(DepartmentType.IT);
            userRepository.save(supervisorIT);
            System.out.println("Usuario Supervisor de IT por defecto creado.");
        }
        
        // Crear Empleado de IT por defecto si no existe (para pruebas)
        if (!userRepository.existsByEmail("empleado.it@example.com")) {
            User empleadoIT = new User();
            empleadoIT.setEmail("empleado.it@example.com");
            empleadoIT.setPassword(passwordEncoder.encode("empIT123")); // Cambia esta contraseña!
            empleadoIT.setUsername("Empleado de IT");
            empleadoIT.setRole(UserRole.EMPLEADO);
            empleadoIT.setDepartment(DepartmentType.IT);
            userRepository.save(empleadoIT);
            System.out.println("Usuario Empleado de IT por defecto creado.");
        }
    }
} 