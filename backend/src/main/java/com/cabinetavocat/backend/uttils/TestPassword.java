package com.cabinetavocat.backend.uttils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.println("Admin: " + encoder.encode("Admin123!"));
        System.out.println("Avocat: " + encoder.encode("Junior123!"));
    }
}