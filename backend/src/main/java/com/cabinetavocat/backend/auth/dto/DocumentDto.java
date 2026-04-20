package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDto {
    private Long id;
    private String nom;
    private String type;
    private String categorie;
    private String fichier;
    private Long taille;
    private String tailleFormatee;
    private String uploadedBy;
    private String dateUpload;
    private Long clientId;
    private String client;
    private Long affaireId;
    private String affaireReference;
}