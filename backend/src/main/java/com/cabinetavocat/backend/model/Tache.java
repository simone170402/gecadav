package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private LocalDate dateEcheance;

    @Enumerated(EnumType.STRING)
    private Priorite priorite;

    private boolean completed;

    private String assigneA;

    @ManyToOne
    private Affaire affaire;

    @ManyToOne
    private Client client;

    public enum Priorite {
        high,
        medium,
        low
    }
}