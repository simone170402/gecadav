package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String type;
    // PDF, IMG, XLS, DOC...

    @Column(nullable = false)
    private String categorie;
    // Contrats, Jugements, Pièces d'identité...

    @Column(nullable = false)
    private String fichier;
    // nom de fichier ou chemin

    private Long taille;
    // en octets

    private String uploadedBy;

    private LocalDate dateUpload;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "affaire_id")
    private Affaire affaire;

    @PrePersist
    public void prePersist() {
        if (dateUpload == null) {
            dateUpload = LocalDate.now();
        }
    }
}