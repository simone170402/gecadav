package com.cabinetavocat.backend.config;

import com.cabinetavocat.backend.model.Role;
import com.cabinetavocat.backend.model.User;
import com.cabinetavocat.backend.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "admin@cabinet.com";

            if (userRepository.findByEmail(email).isEmpty()) {
                User admin = User.builder()
                        .email(email)
                        .password(passwordEncoder.encode("Admin123!"))
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(admin);
                System.out.println("✅ Admin créé : " + email + " / Admin123!");
            }
        };
    }
}