package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureStatsDto {
    private String revenusTotaux;
    private long facturesPayees;
    private long enAttente;
    private long enRetard;
}
