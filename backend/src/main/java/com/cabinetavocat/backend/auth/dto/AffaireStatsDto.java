package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffaireStatsDto {
    private long totalAffaires;
    private long enCours;
    private long urgentes;
    private long cloturees;
}
