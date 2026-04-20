package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "rendezvous")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime heure;

    @Column(nullable = false)
    private LocalTime heureFin;

    @Column(nullable = false)
    private String typeRendezVous;
    // Consultation, Signature, Audience, Suivi...

    private String lieu;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private String statut;
    // PLANIFIE, ANNULE, TERMINE

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "affaire_id")
    private Affaire affaire;

    @PrePersist
    public void prePersist() {
        if (statut == null || statut.isBlank()) {
            statut = "PLANIFIE";
        }
    }
}