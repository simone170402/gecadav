package com.cabinetavocat.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcurationStatsDto {
    private long total;
    private long actives;
    private long enAttente;
    private long expirees;
}
