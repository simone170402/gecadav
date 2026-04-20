package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "procurations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Procuration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;
    // Procuration générale / spéciale / notariée

    @Column(nullable = false, columnDefinition = "TEXT")
    private String scope;
    // Étendue de la procuration

    @Column(nullable = false)
    private String status;
    // Active / En attente / Expirée

    @Column(nullable = false)
    private LocalDate createdDate;

    @Column(nullable = false)
    private LocalDate expiryDate;

    private String signedBy;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @PrePersist
    public void prePersist() {
        if (createdDate == null) {
            createdDate = LocalDate.now();
        }
        if (status == null || status.isBlank()) {
            status = "Active";
        }
    }
}