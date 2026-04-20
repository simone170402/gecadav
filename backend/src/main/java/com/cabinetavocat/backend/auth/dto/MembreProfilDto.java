package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembreProfilDto {
    private Long id;
    private String nomComplet;
    private String role;
    private String specialite;
    private String email;
    private String telephone;
    private String statut;
    private String initiales;

    private int nombreAffaires;
    private int nombreTaches;
    private int nombreFactures;
    private int nombreRendezVous;

    private List<AffaireMiniDto> affaires;
    private List<TacheMiniDto> taches;
}
