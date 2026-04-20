package com.cabinetavocat.backend.auth.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffaireMiniDto {
    private Long id;
    private String reference;
    private String titre;
    private String statut;
    private String priorite;
    private String dateEcheance;
}
