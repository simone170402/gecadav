package com.cabinetavocat.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig {

    // ---------------------------
    // 1. SPRING SECURITY (OPEN API)
    // ---------------------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }

    // ---------------------------
    // 2. GLOBAL CORS CONFIG (IMPORTANT POUR ANGULAR)
    // ---------------------------
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")
                        .allowedOrigins(
                            "http://localhost:4200",             // Angular local
                            "https://gecadav-1.onrender.com",   // Ton backend Render
                            "https://gecadav.onrender.com",     // Ton frontend Render (si déployé ici)
                            "https://cabinet-avocats.com"        // Si tu ajoutes un vrai domaine plus tard
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }
}
