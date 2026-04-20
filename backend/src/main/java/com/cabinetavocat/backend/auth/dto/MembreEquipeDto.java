package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembreEquipeDto {
    private Long id;
    private String nomComplet;
    private String role;
    private String specialite;
    private Integer nombreAffaires;
    private String email;
    private String telephone;
    private String statut;
    private String initiales;
}