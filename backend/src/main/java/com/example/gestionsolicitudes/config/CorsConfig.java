package com.example.gestionsolicitudes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // Aplica CORS a todos los endpoints bajo /api
                    .allowedOrigins("*")       // PERMITIR CUALQUIER ORIGEN (restringir en producción)
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("*")       // PERMITIR CUALQUIER CABECERA
                    .allowCredentials(true)
                    .maxAge(3600);             // Tiempo de vida de la respuesta pre-flight
            }
        };
    }
} 