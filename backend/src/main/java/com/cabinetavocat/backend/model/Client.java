package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    private String telephone;

    private String adresse;

    @Column(nullable = false)
    private String type;
    // Particulier / Entreprise

    private String entreprise;

    @Column(nullable = false)
    private String statut;
    // Actif / Inactif

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDate dateCreation;

    @PrePersist
    public void prePersist() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDate.now();
        }
        if (this.type == null || this.type.isBlank()) {
            this.type = "Particulier";
        }
        if (this.statut == null || this.statut.isBlank()) {
            this.statut = "Actif";
        }
    }
}