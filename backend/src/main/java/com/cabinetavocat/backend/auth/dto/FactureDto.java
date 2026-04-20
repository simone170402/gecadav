package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureDto {
    private Long id;
    private String reference;
    private BigDecimal montant;
    private String montantFormate;
    private String dateEmission;
    private String dateEcheance;
    private String statut;
    private String description;
    private String modePaiement;
    private Long clientId;
    private String clientNomComplet;
    private Long affaireId;
    private String affaireReference;
}