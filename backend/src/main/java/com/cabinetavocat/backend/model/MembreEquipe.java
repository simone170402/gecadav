package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "membres_equipe")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembreEquipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomComplet;

    @Column(nullable = false)
    private String role;
    // Avocat associé / Avocate associée / Avocat / Assistante...

    @Column(nullable = false)
    private String specialite;

    @Column(nullable = false, unique = true)
    private String email;

    private String telephone;

    @Column(nullable = false)
    private String statut;
    // Actif / Inactif
}