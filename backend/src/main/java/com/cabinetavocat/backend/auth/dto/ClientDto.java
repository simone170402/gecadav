package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDto {
    private Long id;
    private String reference;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String email;
    private String telephone;
    private String adresse;
    private String type;
    private String entreprise;
    private String statut;
    private String notes;
    private int nombreAffaires;
    private String dernierContact;
}