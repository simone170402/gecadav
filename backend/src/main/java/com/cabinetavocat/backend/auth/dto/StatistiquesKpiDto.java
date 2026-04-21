package com.cabinetavocat.backend.auth.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatistiquesKpiDto {
    private String revenusCeMois;
    private long nouvellesAffaires;
    private long nouveauxClients;
    private int tauxSucces;
}
