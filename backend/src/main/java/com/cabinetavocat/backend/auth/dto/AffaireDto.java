package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffaireDto {
    private Long id;
    private String reference;
    private String titre;
    private String client;
    private Long clientId;
    private String type;
    private String statut;
    private String priorite;
    private String assigneA;
    private String dateOuverture;
    private String dateEcheance;
    private String description;
    private Integer progression;

    private Integer documentsCount;
    private Integer rendezVousCount;
}