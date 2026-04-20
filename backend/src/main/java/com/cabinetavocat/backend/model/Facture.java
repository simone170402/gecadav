package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "factures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String reference;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;

    @Column(nullable = false)
    private LocalDate dateEmission;

    private LocalDate dateEcheance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FactureStatut statut;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String modePaiement;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "affaire_id")
    private Affaire affaire;

    @PrePersist
    public void prePersist() {
        if (dateEmission == null) {
            dateEmission = LocalDate.now();
        }

        if (statut == null) {
            statut = FactureStatut.EN_ATTENTE;
        }
    }
}