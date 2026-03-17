package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "affaires")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Affaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String statut;

    private LocalDate dateOuverture;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}