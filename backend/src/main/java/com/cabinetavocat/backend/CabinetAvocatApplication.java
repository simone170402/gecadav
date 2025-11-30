package com.cabinetavocat.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CabinetAvocatApplication {
    public static void main(String[] args) {
        SpringApplication.run(CabinetAvocatApplication.class, args);
    }
}
