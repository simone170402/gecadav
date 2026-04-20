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
    private String type;

    @Column(nullable = false)
    private String statut;
    // En cours / Audience prévue / En attente / Clôturée

    @Column(nullable = false)
    private String priorite;
    // high / medium / low

    private String assigneA;

    private LocalDate dateOuverture;

    private LocalDate dateEcheance;
    private LocalDate dateCloture;

    private Integer progression;
    // 0 à 100

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @PrePersist
    public void prePersist() {
        if (dateOuverture == null) {
            dateOuverture = LocalDate.now();
        }
        if (statut == null || statut.isBlank()) {
            statut = "En attente";
        }
        if (priorite == null || priorite.isBlank()) {
            priorite = "medium";
        }
        if (progression == null) {
            progression = 0;
        }
    }
}